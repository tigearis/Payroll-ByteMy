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
  _Any: { input: any; output: any; }
  bigint: { input: string; output: string; }
  bpchar: { input: any; output: any; }
  date: { input: string; output: string; }
  inet: { input: string; output: string; }
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
  timestamp: { input: string; output: string; }
  timestamptz: { input: string; output: string; }
  user_role: { input: any; output: any; }
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
  billingInvoice: billingInvoice;
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
  count?: InputMaybe<billingInvoiceItemAggregateBoolExpCount>;
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
export type BillingInvoiceItemAggregateFieldscountArgs = {
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
  billingInvoice?: InputMaybe<billingInvoiceBoolExp>;
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
  | 'billing_invoice_item_pkey';

/** input type for incrementing numeric columns in table "billing_invoice_item" */
export type BillingInvoiceItemIncInput = {
  quantity?: InputMaybe<Scalars['Int']['input']>;
  unitPrice?: InputMaybe<Scalars['numeric']['input']>;
};

/** input type for inserting data into table "billing_invoice_item" */
export type BillingInvoiceItemInsertInput = {
  billingInvoice?: InputMaybe<billingInvoiceObjRelInsertInput>;
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
  billingInvoice?: InputMaybe<billingInvoiceOrderBy>;
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
  | 'updatedAt';

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
  | 'updatedAt';

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
  | 'DESC';

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
  | 'DESC_NULLS_LAST';

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
export type _Entity = adjustmentRules | appSettings | auditLogs | authEvents | billingEventLogs | billingInvoice | billingItems | billingPlans | clientBillingAssignments | clientExternalSystems | clients | dataAccessLogs | externalSystems | featureFlags | holidays | latestPayrollVersionResults | leave | notes | payrollActivationResults | payrollAssignmentAudits | payrollAssignments | payrollCycles | payrollDateTypes | payrollDates | payrollVersionHistoryResults | payrollVersionResults | payrolls | permissionAuditLogs | permissionChanges | permissionOverrides | permissions | resources | rolePermissions | roles | slowQueries | userInvitations | userRoles | users | workSchedules;

export type _Service = {
  __typename?: '_Service';
  /** SDL representation of schema */
  sdl: Scalars['String']['output'];
};

/** columns and relationships of "adjustment_rules" */
export type adjustmentRules = {
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
  relatedPayrollCycle: payrollCycles;
  /** An object relationship */
  relatedPayrollDateType: payrollDateTypes;
  /** Code/formula used to calculate date adjustments */
  ruleCode: Scalars['String']['output'];
  /** Human-readable description of the adjustment rule */
  ruleDescription: Scalars['String']['output'];
  /** Timestamp when the rule was last updated */
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregated selection of "adjustment_rules" */
export type adjustmentRulesAggregate = {
  __typename?: 'adjustmentRulesAggregate';
  aggregate?: Maybe<adjustmentRulesAggregateFields>;
  nodes: Array<adjustmentRules>;
};

export type adjustmentRulesAggregateBoolExp = {
  count?: InputMaybe<adjustmentRulesAggregateBoolExpCount>;
};

export type adjustmentRulesAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<adjustmentRulesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<adjustmentRulesBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "adjustment_rules" */
export type adjustmentRulesAggregateFields = {
  __typename?: 'adjustmentRulesAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<adjustmentRulesMaxFields>;
  min?: Maybe<adjustmentRulesMinFields>;
};


/** aggregate fields of "adjustment_rules" */
export type adjustmentRulesAggregateFieldscountArgs = {
  columns?: InputMaybe<Array<adjustmentRulesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "adjustment_rules" */
export type adjustmentRulesAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<adjustmentRulesMaxOrderBy>;
  min?: InputMaybe<adjustmentRulesMinOrderBy>;
};

/** input type for inserting array relation for remote table "adjustment_rules" */
export type adjustmentRulesArrRelInsertInput = {
  data: Array<adjustmentRulesInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<adjustmentRulesOnConflict>;
};

/** Boolean expression to filter rows from the table "adjustment_rules". All fields are combined with a logical 'AND'. */
export type adjustmentRulesBoolExp = {
  _and?: InputMaybe<Array<adjustmentRulesBoolExp>>;
  _not?: InputMaybe<adjustmentRulesBoolExp>;
  _or?: InputMaybe<Array<adjustmentRulesBoolExp>>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  cycleId?: InputMaybe<UuidComparisonExp>;
  dateTypeId?: InputMaybe<UuidComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  relatedPayrollCycle?: InputMaybe<payrollCyclesBoolExp>;
  relatedPayrollDateType?: InputMaybe<payrollDateTypesBoolExp>;
  ruleCode?: InputMaybe<StringComparisonExp>;
  ruleDescription?: InputMaybe<StringComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "adjustment_rules" */
export type adjustmentRulesConstraint =
  /** unique or primary key constraint on columns "date_type_id", "cycle_id" */
  | 'adjustment_rules_cycle_id_date_type_id_key'
  /** unique or primary key constraint on columns "id" */
  | 'adjustment_rules_pkey';

/** input type for inserting data into table "adjustment_rules" */
export type adjustmentRulesInsertInput = {
  /** Timestamp when the rule was created */
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Reference to the payroll cycle this rule applies to */
  cycleId?: InputMaybe<Scalars['uuid']['input']>;
  /** Reference to the payroll date type this rule affects */
  dateTypeId?: InputMaybe<Scalars['uuid']['input']>;
  /** Unique identifier for the adjustment rule */
  id?: InputMaybe<Scalars['uuid']['input']>;
  relatedPayrollCycle?: InputMaybe<payrollCyclesObjRelInsertInput>;
  relatedPayrollDateType?: InputMaybe<payrollDateTypesObjRelInsertInput>;
  /** Code/formula used to calculate date adjustments */
  ruleCode?: InputMaybe<Scalars['String']['input']>;
  /** Human-readable description of the adjustment rule */
  ruleDescription?: InputMaybe<Scalars['String']['input']>;
  /** Timestamp when the rule was last updated */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type adjustmentRulesMaxFields = {
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
export type adjustmentRulesMaxOrderBy = {
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
export type adjustmentRulesMinFields = {
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
export type adjustmentRulesMinOrderBy = {
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
export type adjustmentRulesMutationResponse = {
  __typename?: 'adjustmentRulesMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<adjustmentRules>;
};

/** on_conflict condition type for table "adjustment_rules" */
export type adjustmentRulesOnConflict = {
  constraint: adjustmentRulesConstraint;
  updateColumns?: Array<adjustmentRulesUpdateColumn>;
  where?: InputMaybe<adjustmentRulesBoolExp>;
};

/** Ordering options when selecting data from "adjustment_rules". */
export type adjustmentRulesOrderBy = {
  createdAt?: InputMaybe<OrderBy>;
  cycleId?: InputMaybe<OrderBy>;
  dateTypeId?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  relatedPayrollCycle?: InputMaybe<payrollCyclesOrderBy>;
  relatedPayrollDateType?: InputMaybe<payrollDateTypesOrderBy>;
  ruleCode?: InputMaybe<OrderBy>;
  ruleDescription?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: adjustment_rules */
export type adjustmentRulesPkColumnsInput = {
  /** Unique identifier for the adjustment rule */
  id: Scalars['uuid']['input'];
};

/** select columns of table "adjustment_rules" */
export type adjustmentRulesSelectColumn =
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
  | 'updatedAt';

/** input type for updating data in table "adjustment_rules" */
export type adjustmentRulesSetInput = {
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
export type adjustmentRulesStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: adjustmentRulesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type adjustmentRulesStreamCursorValueInput = {
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
export type adjustmentRulesUpdateColumn =
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
  | 'updatedAt';

export type adjustmentRulesUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<adjustmentRulesSetInput>;
  /** filter the rows which have to be updated */
  where: adjustmentRulesBoolExp;
};

/** columns and relationships of "app_settings" */
export type appSettings = {
  __typename?: 'appSettings';
  /** Unique identifier for application setting */
  id: Scalars['String']['output'];
  /** JSON structure containing application permission configurations */
  permissions?: Maybe<Scalars['jsonb']['output']>;
};


/** columns and relationships of "app_settings" */
export type appSettingspermissionsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "app_settings" */
export type appSettingsAggregate = {
  __typename?: 'appSettingsAggregate';
  aggregate?: Maybe<appSettingsAggregateFields>;
  nodes: Array<appSettings>;
};

/** aggregate fields of "app_settings" */
export type appSettingsAggregateFields = {
  __typename?: 'appSettingsAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<appSettingsMaxFields>;
  min?: Maybe<appSettingsMinFields>;
};


/** aggregate fields of "app_settings" */
export type appSettingsAggregateFieldscountArgs = {
  columns?: InputMaybe<Array<appSettingsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type appSettingsAppendInput = {
  /** JSON structure containing application permission configurations */
  permissions?: InputMaybe<Scalars['jsonb']['input']>;
};

/** Boolean expression to filter rows from the table "app_settings". All fields are combined with a logical 'AND'. */
export type appSettingsBoolExp = {
  _and?: InputMaybe<Array<appSettingsBoolExp>>;
  _not?: InputMaybe<appSettingsBoolExp>;
  _or?: InputMaybe<Array<appSettingsBoolExp>>;
  id?: InputMaybe<StringComparisonExp>;
  permissions?: InputMaybe<JsonbComparisonExp>;
};

/** unique or primary key constraints on table "app_settings" */
export type appSettingsConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'app_settings_pkey';

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type appSettingsDeleteAtPathInput = {
  /** JSON structure containing application permission configurations */
  permissions?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type appSettingsDeleteElemInput = {
  /** JSON structure containing application permission configurations */
  permissions?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type appSettingsDeleteKeyInput = {
  /** JSON structure containing application permission configurations */
  permissions?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "app_settings" */
export type appSettingsInsertInput = {
  /** Unique identifier for application setting */
  id?: InputMaybe<Scalars['String']['input']>;
  /** JSON structure containing application permission configurations */
  permissions?: InputMaybe<Scalars['jsonb']['input']>;
};

/** aggregate max on columns */
export type appSettingsMaxFields = {
  __typename?: 'appSettingsMaxFields';
  /** Unique identifier for application setting */
  id?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type appSettingsMinFields = {
  __typename?: 'appSettingsMinFields';
  /** Unique identifier for application setting */
  id?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "app_settings" */
export type appSettingsMutationResponse = {
  __typename?: 'appSettingsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<appSettings>;
};

/** on_conflict condition type for table "app_settings" */
export type appSettingsOnConflict = {
  constraint: appSettingsConstraint;
  updateColumns?: Array<appSettingsUpdateColumn>;
  where?: InputMaybe<appSettingsBoolExp>;
};

/** Ordering options when selecting data from "app_settings". */
export type appSettingsOrderBy = {
  id?: InputMaybe<OrderBy>;
  permissions?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: app_settings */
export type appSettingsPkColumnsInput = {
  /** Unique identifier for application setting */
  id: Scalars['String']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type appSettingsPrependInput = {
  /** JSON structure containing application permission configurations */
  permissions?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "app_settings" */
export type appSettingsSelectColumn =
  /** column name */
  | 'id'
  /** column name */
  | 'permissions';

/** input type for updating data in table "app_settings" */
export type appSettingsSetInput = {
  /** Unique identifier for application setting */
  id?: InputMaybe<Scalars['String']['input']>;
  /** JSON structure containing application permission configurations */
  permissions?: InputMaybe<Scalars['jsonb']['input']>;
};

/** Streaming cursor of the table "appSettings" */
export type appSettingsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: appSettingsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type appSettingsStreamCursorValueInput = {
  /** Unique identifier for application setting */
  id?: InputMaybe<Scalars['String']['input']>;
  /** JSON structure containing application permission configurations */
  permissions?: InputMaybe<Scalars['jsonb']['input']>;
};

/** update columns of table "app_settings" */
export type appSettingsUpdateColumn =
  /** column name */
  | 'id'
  /** column name */
  | 'permissions';

export type appSettingsUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<appSettingsAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _deleteAtPath?: InputMaybe<appSettingsDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _deleteElem?: InputMaybe<appSettingsDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _deleteKey?: InputMaybe<appSettingsDeleteKeyInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<appSettingsPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<appSettingsSetInput>;
  /** filter the rows which have to be updated */
  where: appSettingsBoolExp;
};

/** columns and relationships of "audit.audit_log" */
export type auditLogs = {
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
export type auditLogsmetadataArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "audit.audit_log" */
export type auditLogsnewValuesArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "audit.audit_log" */
export type auditLogsoldValuesArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "audit.audit_log" */
export type auditLogsAggregate = {
  __typename?: 'auditLogsAggregate';
  aggregate?: Maybe<auditLogsAggregateFields>;
  nodes: Array<auditLogs>;
};

/** aggregate fields of "audit.audit_log" */
export type auditLogsAggregateFields = {
  __typename?: 'auditLogsAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<auditLogsMaxFields>;
  min?: Maybe<auditLogsMinFields>;
};


/** aggregate fields of "audit.audit_log" */
export type auditLogsAggregateFieldscountArgs = {
  columns?: InputMaybe<Array<auditLogsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type auditLogsAppendInput = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  newValues?: InputMaybe<Scalars['jsonb']['input']>;
  oldValues?: InputMaybe<Scalars['jsonb']['input']>;
};

/** Boolean expression to filter rows from the table "audit.audit_log". All fields are combined with a logical 'AND'. */
export type auditLogsBoolExp = {
  _and?: InputMaybe<Array<auditLogsBoolExp>>;
  _not?: InputMaybe<auditLogsBoolExp>;
  _or?: InputMaybe<Array<auditLogsBoolExp>>;
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
export type auditLogsConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'audit_log_pkey';

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type auditLogsDeleteAtPathInput = {
  metadata?: InputMaybe<Array<Scalars['String']['input']>>;
  newValues?: InputMaybe<Array<Scalars['String']['input']>>;
  oldValues?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type auditLogsDeleteElemInput = {
  metadata?: InputMaybe<Scalars['Int']['input']>;
  newValues?: InputMaybe<Scalars['Int']['input']>;
  oldValues?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type auditLogsDeleteKeyInput = {
  metadata?: InputMaybe<Scalars['String']['input']>;
  newValues?: InputMaybe<Scalars['String']['input']>;
  oldValues?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "audit.audit_log" */
export type auditLogsInsertInput = {
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
export type auditLogsMaxFields = {
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
export type auditLogsMinFields = {
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
export type auditLogsMutationResponse = {
  __typename?: 'auditLogsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<auditLogs>;
};

/** on_conflict condition type for table "audit.audit_log" */
export type auditLogsOnConflict = {
  constraint: auditLogsConstraint;
  updateColumns?: Array<auditLogsUpdateColumn>;
  where?: InputMaybe<auditLogsBoolExp>;
};

/** Ordering options when selecting data from "audit.audit_log". */
export type auditLogsOrderBy = {
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
export type auditLogsPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type auditLogsPrependInput = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  newValues?: InputMaybe<Scalars['jsonb']['input']>;
  oldValues?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "audit.audit_log" */
export type auditLogsSelectColumn =
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
  | 'userRole';

/** input type for updating data in table "audit.audit_log" */
export type auditLogsSetInput = {
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
export type auditLogsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: auditLogsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type auditLogsStreamCursorValueInput = {
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
export type auditLogsUpdateColumn =
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
  | 'userRole';

export type auditLogsUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<auditLogsAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _deleteAtPath?: InputMaybe<auditLogsDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _deleteElem?: InputMaybe<auditLogsDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _deleteKey?: InputMaybe<auditLogsDeleteKeyInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<auditLogsPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<auditLogsSetInput>;
  /** filter the rows which have to be updated */
  where: auditLogsBoolExp;
};

/** columns and relationships of "audit.auth_events" */
export type authEvents = {
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
export type authEventsmetadataArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "audit.auth_events" */
export type authEventsAggregate = {
  __typename?: 'authEventsAggregate';
  aggregate?: Maybe<authEventsAggregateFields>;
  nodes: Array<authEvents>;
};

/** aggregate fields of "audit.auth_events" */
export type authEventsAggregateFields = {
  __typename?: 'authEventsAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<authEventsMaxFields>;
  min?: Maybe<authEventsMinFields>;
};


/** aggregate fields of "audit.auth_events" */
export type authEventsAggregateFieldscountArgs = {
  columns?: InputMaybe<Array<authEventsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type authEventsAppendInput = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
};

/** Boolean expression to filter rows from the table "audit.auth_events". All fields are combined with a logical 'AND'. */
export type authEventsBoolExp = {
  _and?: InputMaybe<Array<authEventsBoolExp>>;
  _not?: InputMaybe<authEventsBoolExp>;
  _or?: InputMaybe<Array<authEventsBoolExp>>;
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
export type authEventsConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'auth_events_pkey';

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type authEventsDeleteAtPathInput = {
  metadata?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type authEventsDeleteElemInput = {
  metadata?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type authEventsDeleteKeyInput = {
  metadata?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "audit.auth_events" */
export type authEventsInsertInput = {
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
export type authEventsMaxFields = {
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
export type authEventsMinFields = {
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
export type authEventsMutationResponse = {
  __typename?: 'authEventsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<authEvents>;
};

/** on_conflict condition type for table "audit.auth_events" */
export type authEventsOnConflict = {
  constraint: authEventsConstraint;
  updateColumns?: Array<authEventsUpdateColumn>;
  where?: InputMaybe<authEventsBoolExp>;
};

/** Ordering options when selecting data from "audit.auth_events". */
export type authEventsOrderBy = {
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
export type authEventsPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type authEventsPrependInput = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "audit.auth_events" */
export type authEventsSelectColumn =
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
  | 'userId';

/** input type for updating data in table "audit.auth_events" */
export type authEventsSetInput = {
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
export type authEventsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: authEventsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type authEventsStreamCursorValueInput = {
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
export type authEventsUpdateColumn =
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
  | 'userId';

export type authEventsUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<authEventsAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _deleteAtPath?: InputMaybe<authEventsDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _deleteElem?: InputMaybe<authEventsDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _deleteKey?: InputMaybe<authEventsDeleteKeyInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<authEventsPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<authEventsSetInput>;
  /** filter the rows which have to be updated */
  where: authEventsBoolExp;
};

/** columns and relationships of "neon_auth.users_sync" */
export type authUsersSync = {
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
export type authUsersSyncrawJsonArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "neon_auth.users_sync" */
export type authUsersSyncAggregate = {
  __typename?: 'authUsersSyncAggregate';
  aggregate?: Maybe<authUsersSyncAggregateFields>;
  nodes: Array<authUsersSync>;
};

/** aggregate fields of "neon_auth.users_sync" */
export type authUsersSyncAggregateFields = {
  __typename?: 'authUsersSyncAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<authUsersSyncMaxFields>;
  min?: Maybe<authUsersSyncMinFields>;
};


/** aggregate fields of "neon_auth.users_sync" */
export type authUsersSyncAggregateFieldscountArgs = {
  columns?: InputMaybe<Array<authUsersSyncSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type authUsersSyncAppendInput = {
  /** Complete JSON data from the authentication provider */
  rawJson?: InputMaybe<Scalars['jsonb']['input']>;
};

/** Boolean expression to filter rows from the table "neon_auth.users_sync". All fields are combined with a logical 'AND'. */
export type authUsersSyncBoolExp = {
  _and?: InputMaybe<Array<authUsersSyncBoolExp>>;
  _not?: InputMaybe<authUsersSyncBoolExp>;
  _or?: InputMaybe<Array<authUsersSyncBoolExp>>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  deletedAt?: InputMaybe<TimestamptzComparisonExp>;
  email?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<StringComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  rawJson?: InputMaybe<JsonbComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "neon_auth.users_sync" */
export type authUsersSyncConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'users_sync_pkey';

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type authUsersSyncDeleteAtPathInput = {
  /** Complete JSON data from the authentication provider */
  rawJson?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type authUsersSyncDeleteElemInput = {
  /** Complete JSON data from the authentication provider */
  rawJson?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type authUsersSyncDeleteKeyInput = {
  /** Complete JSON data from the authentication provider */
  rawJson?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "neon_auth.users_sync" */
export type authUsersSyncInsertInput = {
  /** Timestamp when the user was deleted in the auth system */
  deletedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Complete JSON data from the authentication provider */
  rawJson?: InputMaybe<Scalars['jsonb']['input']>;
  /** Timestamp when the user was last updated in the auth system */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type authUsersSyncMaxFields = {
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
export type authUsersSyncMinFields = {
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
export type authUsersSyncMutationResponse = {
  __typename?: 'authUsersSyncMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<authUsersSync>;
};

/** on_conflict condition type for table "neon_auth.users_sync" */
export type authUsersSyncOnConflict = {
  constraint: authUsersSyncConstraint;
  updateColumns?: Array<authUsersSyncUpdateColumn>;
  where?: InputMaybe<authUsersSyncBoolExp>;
};

/** Ordering options when selecting data from "neon_auth.users_sync". */
export type authUsersSyncOrderBy = {
  createdAt?: InputMaybe<OrderBy>;
  deletedAt?: InputMaybe<OrderBy>;
  email?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  rawJson?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: neon_auth.users_sync */
export type authUsersSyncPkColumnsInput = {
  /** Unique identifier from the authentication provider */
  id: Scalars['String']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type authUsersSyncPrependInput = {
  /** Complete JSON data from the authentication provider */
  rawJson?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "neon_auth.users_sync" */
export type authUsersSyncSelectColumn =
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
  | 'updatedAt';

/** input type for updating data in table "neon_auth.users_sync" */
export type authUsersSyncSetInput = {
  /** Timestamp when the user was deleted in the auth system */
  deletedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Complete JSON data from the authentication provider */
  rawJson?: InputMaybe<Scalars['jsonb']['input']>;
  /** Timestamp when the user was last updated in the auth system */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "authUsersSync" */
export type authUsersSyncStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: authUsersSyncStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type authUsersSyncStreamCursorValueInput = {
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
export type authUsersSyncUpdateColumn =
  /** column name */
  | 'deletedAt'
  /** column name */
  | 'rawJson'
  /** column name */
  | 'updatedAt';

export type authUsersSyncUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<authUsersSyncAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _deleteAtPath?: InputMaybe<authUsersSyncDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _deleteElem?: InputMaybe<authUsersSyncDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _deleteKey?: InputMaybe<authUsersSyncDeleteKeyInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<authUsersSyncPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<authUsersSyncSetInput>;
  /** filter the rows which have to be updated */
  where: authUsersSyncBoolExp;
};

/** columns and relationships of "billing_event_log" */
export type billingEventLogs = {
  __typename?: 'billingEventLogs';
  /** An object relationship */
  billingInvoice?: Maybe<billingInvoice>;
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  createdBy?: Maybe<Scalars['uuid']['output']>;
  /** An object relationship */
  createdByUser?: Maybe<users>;
  eventType: Scalars['String']['output'];
  id: Scalars['uuid']['output'];
  invoiceId?: Maybe<Scalars['uuid']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

/** aggregated selection of "billing_event_log" */
export type billingEventLogsAggregate = {
  __typename?: 'billingEventLogsAggregate';
  aggregate?: Maybe<billingEventLogsAggregateFields>;
  nodes: Array<billingEventLogs>;
};

export type billingEventLogsAggregateBoolExp = {
  count?: InputMaybe<billingEventLogsAggregateBoolExpCount>;
};

export type billingEventLogsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<billingEventLogsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<billingEventLogsBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "billing_event_log" */
export type billingEventLogsAggregateFields = {
  __typename?: 'billingEventLogsAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<billingEventLogsMaxFields>;
  min?: Maybe<billingEventLogsMinFields>;
};


/** aggregate fields of "billing_event_log" */
export type billingEventLogsAggregateFieldscountArgs = {
  columns?: InputMaybe<Array<billingEventLogsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "billing_event_log" */
export type billingEventLogsAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<billingEventLogsMaxOrderBy>;
  min?: InputMaybe<billingEventLogsMinOrderBy>;
};

/** input type for inserting array relation for remote table "billing_event_log" */
export type billingEventLogsArrRelInsertInput = {
  data: Array<billingEventLogsInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<billingEventLogsOnConflict>;
};

/** Boolean expression to filter rows from the table "billing_event_log". All fields are combined with a logical 'AND'. */
export type billingEventLogsBoolExp = {
  _and?: InputMaybe<Array<billingEventLogsBoolExp>>;
  _not?: InputMaybe<billingEventLogsBoolExp>;
  _or?: InputMaybe<Array<billingEventLogsBoolExp>>;
  billingInvoice?: InputMaybe<billingInvoiceBoolExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  createdBy?: InputMaybe<UuidComparisonExp>;
  createdByUser?: InputMaybe<usersBoolExp>;
  eventType?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  invoiceId?: InputMaybe<UuidComparisonExp>;
  message?: InputMaybe<StringComparisonExp>;
};

/** unique or primary key constraints on table "billing_event_log" */
export type billingEventLogsConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'billing_event_log_pkey';

/** input type for inserting data into table "billing_event_log" */
export type billingEventLogsInsertInput = {
  billingInvoice?: InputMaybe<billingInvoiceObjRelInsertInput>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  createdBy?: InputMaybe<Scalars['uuid']['input']>;
  createdByUser?: InputMaybe<usersObjRelInsertInput>;
  eventType?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  invoiceId?: InputMaybe<Scalars['uuid']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type billingEventLogsMaxFields = {
  __typename?: 'billingEventLogsMaxFields';
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  createdBy?: Maybe<Scalars['uuid']['output']>;
  eventType?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  invoiceId?: Maybe<Scalars['uuid']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

/** order by max() on columns of table "billing_event_log" */
export type billingEventLogsMaxOrderBy = {
  createdAt?: InputMaybe<OrderBy>;
  createdBy?: InputMaybe<OrderBy>;
  eventType?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  invoiceId?: InputMaybe<OrderBy>;
  message?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type billingEventLogsMinFields = {
  __typename?: 'billingEventLogsMinFields';
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  createdBy?: Maybe<Scalars['uuid']['output']>;
  eventType?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  invoiceId?: Maybe<Scalars['uuid']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

/** order by min() on columns of table "billing_event_log" */
export type billingEventLogsMinOrderBy = {
  createdAt?: InputMaybe<OrderBy>;
  createdBy?: InputMaybe<OrderBy>;
  eventType?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  invoiceId?: InputMaybe<OrderBy>;
  message?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "billing_event_log" */
export type billingEventLogsMutationResponse = {
  __typename?: 'billingEventLogsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<billingEventLogs>;
};

/** on_conflict condition type for table "billing_event_log" */
export type billingEventLogsOnConflict = {
  constraint: billingEventLogsConstraint;
  updateColumns?: Array<billingEventLogsUpdateColumn>;
  where?: InputMaybe<billingEventLogsBoolExp>;
};

/** Ordering options when selecting data from "billing_event_log". */
export type billingEventLogsOrderBy = {
  billingInvoice?: InputMaybe<billingInvoiceOrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  createdBy?: InputMaybe<OrderBy>;
  createdByUser?: InputMaybe<usersOrderBy>;
  eventType?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  invoiceId?: InputMaybe<OrderBy>;
  message?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: billing_event_log */
export type billingEventLogsPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "billing_event_log" */
export type billingEventLogsSelectColumn =
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
  | 'message';

/** input type for updating data in table "billing_event_log" */
export type billingEventLogsSetInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  createdBy?: InputMaybe<Scalars['uuid']['input']>;
  eventType?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  invoiceId?: InputMaybe<Scalars['uuid']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "billingEventLogs" */
export type billingEventLogsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: billingEventLogsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type billingEventLogsStreamCursorValueInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  createdBy?: InputMaybe<Scalars['uuid']['input']>;
  eventType?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  invoiceId?: InputMaybe<Scalars['uuid']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "billing_event_log" */
export type billingEventLogsUpdateColumn =
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
  | 'message';

export type billingEventLogsUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<billingEventLogsSetInput>;
  /** filter the rows which have to be updated */
  where: billingEventLogsBoolExp;
};

/** columns and relationships of "billing_invoice" */
export type billingInvoice = {
  __typename?: 'billingInvoice';
  /** An array relationship */
  billingEventLogs: Array<billingEventLogs>;
  /** An aggregate relationship */
  billingEventLogsAggregate: billingEventLogsAggregate;
  /** An array relationship */
  billingInvoiceItems: Array<BillingInvoiceItem>;
  /** An aggregate relationship */
  billingInvoiceItemsAggregate: BillingInvoiceItemAggregate;
  billingPeriodEnd: Scalars['date']['output'];
  billingPeriodStart: Scalars['date']['output'];
  /** An object relationship */
  client: clients;
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
export type billingInvoicebillingEventLogsArgs = {
  distinctOn?: InputMaybe<Array<billingEventLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<billingEventLogsOrderBy>>;
  where?: InputMaybe<billingEventLogsBoolExp>;
};


/** columns and relationships of "billing_invoice" */
export type billingInvoicebillingEventLogsAggregateArgs = {
  distinctOn?: InputMaybe<Array<billingEventLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<billingEventLogsOrderBy>>;
  where?: InputMaybe<billingEventLogsBoolExp>;
};


/** columns and relationships of "billing_invoice" */
export type billingInvoicebillingInvoiceItemsArgs = {
  distinctOn?: InputMaybe<Array<BillingInvoiceItemSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BillingInvoiceItemOrderBy>>;
  where?: InputMaybe<BillingInvoiceItemBoolExp>;
};


/** columns and relationships of "billing_invoice" */
export type billingInvoicebillingInvoiceItemsAggregateArgs = {
  distinctOn?: InputMaybe<Array<BillingInvoiceItemSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BillingInvoiceItemOrderBy>>;
  where?: InputMaybe<BillingInvoiceItemBoolExp>;
};

/** aggregated selection of "billing_invoice" */
export type billingInvoiceAggregate = {
  __typename?: 'billingInvoiceAggregate';
  aggregate?: Maybe<billingInvoiceAggregateFields>;
  nodes: Array<billingInvoice>;
};

export type billingInvoiceAggregateBoolExp = {
  count?: InputMaybe<billingInvoiceAggregateBoolExpCount>;
};

export type billingInvoiceAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<billingInvoiceSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<billingInvoiceBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "billing_invoice" */
export type billingInvoiceAggregateFields = {
  __typename?: 'billingInvoiceAggregateFields';
  avg?: Maybe<billingInvoiceAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<billingInvoiceMaxFields>;
  min?: Maybe<billingInvoiceMinFields>;
  stddev?: Maybe<billingInvoiceStddevFields>;
  stddevPop?: Maybe<billingInvoiceStddevPopFields>;
  stddevSamp?: Maybe<billingInvoiceStddevSampFields>;
  sum?: Maybe<billingInvoiceSumFields>;
  varPop?: Maybe<billingInvoiceVarPopFields>;
  varSamp?: Maybe<billingInvoiceVarSampFields>;
  variance?: Maybe<billingInvoiceVarianceFields>;
};


/** aggregate fields of "billing_invoice" */
export type billingInvoiceAggregateFieldscountArgs = {
  columns?: InputMaybe<Array<billingInvoiceSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "billing_invoice" */
export type billingInvoiceAggregateOrderBy = {
  avg?: InputMaybe<billingInvoiceAvgOrderBy>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<billingInvoiceMaxOrderBy>;
  min?: InputMaybe<billingInvoiceMinOrderBy>;
  stddev?: InputMaybe<billingInvoiceStddevOrderBy>;
  stddevPop?: InputMaybe<billingInvoiceStddevPopOrderBy>;
  stddevSamp?: InputMaybe<billingInvoiceStddevSampOrderBy>;
  sum?: InputMaybe<billingInvoiceSumOrderBy>;
  varPop?: InputMaybe<billingInvoiceVarPopOrderBy>;
  varSamp?: InputMaybe<billingInvoiceVarSampOrderBy>;
  variance?: InputMaybe<billingInvoiceVarianceOrderBy>;
};

/** input type for inserting array relation for remote table "billing_invoice" */
export type billingInvoiceArrRelInsertInput = {
  data: Array<billingInvoiceInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<billingInvoiceOnConflict>;
};

/** aggregate avg on columns */
export type billingInvoiceAvgFields = {
  __typename?: 'billingInvoiceAvgFields';
  totalAmount?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "billing_invoice" */
export type billingInvoiceAvgOrderBy = {
  totalAmount?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "billing_invoice". All fields are combined with a logical 'AND'. */
export type billingInvoiceBoolExp = {
  _and?: InputMaybe<Array<billingInvoiceBoolExp>>;
  _not?: InputMaybe<billingInvoiceBoolExp>;
  _or?: InputMaybe<Array<billingInvoiceBoolExp>>;
  billingEventLogs?: InputMaybe<billingEventLogsBoolExp>;
  billingEventLogsAggregate?: InputMaybe<billingEventLogsAggregateBoolExp>;
  billingInvoiceItems?: InputMaybe<BillingInvoiceItemBoolExp>;
  billingInvoiceItemsAggregate?: InputMaybe<BillingInvoiceItemAggregateBoolExp>;
  billingPeriodEnd?: InputMaybe<DateComparisonExp>;
  billingPeriodStart?: InputMaybe<DateComparisonExp>;
  client?: InputMaybe<clientsBoolExp>;
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
export type billingInvoiceConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'billing_invoice_pkey';

/** input type for incrementing numeric columns in table "billing_invoice" */
export type billingInvoiceIncInput = {
  totalAmount?: InputMaybe<Scalars['numeric']['input']>;
};

/** input type for inserting data into table "billing_invoice" */
export type billingInvoiceInsertInput = {
  billingEventLogs?: InputMaybe<billingEventLogsArrRelInsertInput>;
  billingInvoiceItems?: InputMaybe<BillingInvoiceItemArrRelInsertInput>;
  billingPeriodEnd?: InputMaybe<Scalars['date']['input']>;
  billingPeriodStart?: InputMaybe<Scalars['date']['input']>;
  client?: InputMaybe<clientsObjRelInsertInput>;
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

export type billingInvoiceItemAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<BillingInvoiceItemSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<BillingInvoiceItemBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate max on columns */
export type billingInvoiceMaxFields = {
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
export type billingInvoiceMaxOrderBy = {
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
export type billingInvoiceMinFields = {
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
export type billingInvoiceMinOrderBy = {
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
export type billingInvoiceMutationResponse = {
  __typename?: 'billingInvoiceMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<billingInvoice>;
};

/** input type for inserting object relation for remote table "billing_invoice" */
export type billingInvoiceObjRelInsertInput = {
  data: billingInvoiceInsertInput;
  /** upsert condition */
  onConflict?: InputMaybe<billingInvoiceOnConflict>;
};

/** on_conflict condition type for table "billing_invoice" */
export type billingInvoiceOnConflict = {
  constraint: billingInvoiceConstraint;
  updateColumns?: Array<billingInvoiceUpdateColumn>;
  where?: InputMaybe<billingInvoiceBoolExp>;
};

/** Ordering options when selecting data from "billing_invoice". */
export type billingInvoiceOrderBy = {
  billingEventLogsAggregate?: InputMaybe<billingEventLogsAggregateOrderBy>;
  billingInvoiceItemsAggregate?: InputMaybe<BillingInvoiceItemAggregateOrderBy>;
  billingPeriodEnd?: InputMaybe<OrderBy>;
  billingPeriodStart?: InputMaybe<OrderBy>;
  client?: InputMaybe<clientsOrderBy>;
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
export type billingInvoicePkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "billing_invoice" */
export type billingInvoiceSelectColumn =
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
  | 'updatedAt';

/** input type for updating data in table "billing_invoice" */
export type billingInvoiceSetInput = {
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
export type billingInvoiceStddevFields = {
  __typename?: 'billingInvoiceStddevFields';
  totalAmount?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "billing_invoice" */
export type billingInvoiceStddevOrderBy = {
  totalAmount?: InputMaybe<OrderBy>;
};

/** aggregate stddevPop on columns */
export type billingInvoiceStddevPopFields = {
  __typename?: 'billingInvoiceStddevPopFields';
  totalAmount?: Maybe<Scalars['Float']['output']>;
};

/** order by stddevPop() on columns of table "billing_invoice" */
export type billingInvoiceStddevPopOrderBy = {
  totalAmount?: InputMaybe<OrderBy>;
};

/** aggregate stddevSamp on columns */
export type billingInvoiceStddevSampFields = {
  __typename?: 'billingInvoiceStddevSampFields';
  totalAmount?: Maybe<Scalars['Float']['output']>;
};

/** order by stddevSamp() on columns of table "billing_invoice" */
export type billingInvoiceStddevSampOrderBy = {
  totalAmount?: InputMaybe<OrderBy>;
};

/** Streaming cursor of the table "billingInvoice" */
export type billingInvoiceStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: billingInvoiceStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type billingInvoiceStreamCursorValueInput = {
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
export type billingInvoiceSumFields = {
  __typename?: 'billingInvoiceSumFields';
  totalAmount?: Maybe<Scalars['numeric']['output']>;
};

/** order by sum() on columns of table "billing_invoice" */
export type billingInvoiceSumOrderBy = {
  totalAmount?: InputMaybe<OrderBy>;
};

/** update columns of table "billing_invoice" */
export type billingInvoiceUpdateColumn =
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
  | 'updatedAt';

export type billingInvoiceUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<billingInvoiceIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<billingInvoiceSetInput>;
  /** filter the rows which have to be updated */
  where: billingInvoiceBoolExp;
};

/** aggregate varPop on columns */
export type billingInvoiceVarPopFields = {
  __typename?: 'billingInvoiceVarPopFields';
  totalAmount?: Maybe<Scalars['Float']['output']>;
};

/** order by varPop() on columns of table "billing_invoice" */
export type billingInvoiceVarPopOrderBy = {
  totalAmount?: InputMaybe<OrderBy>;
};

/** aggregate varSamp on columns */
export type billingInvoiceVarSampFields = {
  __typename?: 'billingInvoiceVarSampFields';
  totalAmount?: Maybe<Scalars['Float']['output']>;
};

/** order by varSamp() on columns of table "billing_invoice" */
export type billingInvoiceVarSampOrderBy = {
  totalAmount?: InputMaybe<OrderBy>;
};

/** aggregate variance on columns */
export type billingInvoiceVarianceFields = {
  __typename?: 'billingInvoiceVarianceFields';
  totalAmount?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "billing_invoice" */
export type billingInvoiceVarianceOrderBy = {
  totalAmount?: InputMaybe<OrderBy>;
};

/** columns and relationships of "billing_items" */
export type billingItems = {
  __typename?: 'billingItems';
  amount?: Maybe<Scalars['numeric']['output']>;
  createdAt?: Maybe<Scalars['timestamp']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['uuid']['output'];
  invoiceId?: Maybe<Scalars['uuid']['output']>;
  payrollId?: Maybe<Scalars['uuid']['output']>;
  quantity: Scalars['Int']['output'];
  /** An object relationship */
  relatedPayroll?: Maybe<payrolls>;
  unitPrice: Scalars['numeric']['output'];
};

/** aggregated selection of "billing_items" */
export type billingItemsAggregate = {
  __typename?: 'billingItemsAggregate';
  aggregate?: Maybe<billingItemsAggregateFields>;
  nodes: Array<billingItems>;
};

export type billingItemsAggregateBoolExp = {
  count?: InputMaybe<billingItemsAggregateBoolExpCount>;
};

export type billingItemsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<billingItemsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<billingItemsBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "billing_items" */
export type billingItemsAggregateFields = {
  __typename?: 'billingItemsAggregateFields';
  avg?: Maybe<billingItemsAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<billingItemsMaxFields>;
  min?: Maybe<billingItemsMinFields>;
  stddev?: Maybe<billingItemsStddevFields>;
  stddevPop?: Maybe<billingItemsStddevPopFields>;
  stddevSamp?: Maybe<billingItemsStddevSampFields>;
  sum?: Maybe<billingItemsSumFields>;
  varPop?: Maybe<billingItemsVarPopFields>;
  varSamp?: Maybe<billingItemsVarSampFields>;
  variance?: Maybe<billingItemsVarianceFields>;
};


/** aggregate fields of "billing_items" */
export type billingItemsAggregateFieldscountArgs = {
  columns?: InputMaybe<Array<billingItemsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "billing_items" */
export type billingItemsAggregateOrderBy = {
  avg?: InputMaybe<billingItemsAvgOrderBy>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<billingItemsMaxOrderBy>;
  min?: InputMaybe<billingItemsMinOrderBy>;
  stddev?: InputMaybe<billingItemsStddevOrderBy>;
  stddevPop?: InputMaybe<billingItemsStddevPopOrderBy>;
  stddevSamp?: InputMaybe<billingItemsStddevSampOrderBy>;
  sum?: InputMaybe<billingItemsSumOrderBy>;
  varPop?: InputMaybe<billingItemsVarPopOrderBy>;
  varSamp?: InputMaybe<billingItemsVarSampOrderBy>;
  variance?: InputMaybe<billingItemsVarianceOrderBy>;
};

/** input type for inserting array relation for remote table "billing_items" */
export type billingItemsArrRelInsertInput = {
  data: Array<billingItemsInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<billingItemsOnConflict>;
};

/** aggregate avg on columns */
export type billingItemsAvgFields = {
  __typename?: 'billingItemsAvgFields';
  amount?: Maybe<Scalars['Float']['output']>;
  quantity?: Maybe<Scalars['Float']['output']>;
  unitPrice?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "billing_items" */
export type billingItemsAvgOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "billing_items". All fields are combined with a logical 'AND'. */
export type billingItemsBoolExp = {
  _and?: InputMaybe<Array<billingItemsBoolExp>>;
  _not?: InputMaybe<billingItemsBoolExp>;
  _or?: InputMaybe<Array<billingItemsBoolExp>>;
  amount?: InputMaybe<NumericComparisonExp>;
  createdAt?: InputMaybe<TimestampComparisonExp>;
  description?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  invoiceId?: InputMaybe<UuidComparisonExp>;
  payrollId?: InputMaybe<UuidComparisonExp>;
  quantity?: InputMaybe<IntComparisonExp>;
  relatedPayroll?: InputMaybe<payrollsBoolExp>;
  unitPrice?: InputMaybe<NumericComparisonExp>;
};

/** unique or primary key constraints on table "billing_items" */
export type billingItemsConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'billing_items_pkey';

/** input type for incrementing numeric columns in table "billing_items" */
export type billingItemsIncInput = {
  quantity?: InputMaybe<Scalars['Int']['input']>;
  unitPrice?: InputMaybe<Scalars['numeric']['input']>;
};

/** input type for inserting data into table "billing_items" */
export type billingItemsInsertInput = {
  createdAt?: InputMaybe<Scalars['timestamp']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  invoiceId?: InputMaybe<Scalars['uuid']['input']>;
  payrollId?: InputMaybe<Scalars['uuid']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  relatedPayroll?: InputMaybe<payrollsObjRelInsertInput>;
  unitPrice?: InputMaybe<Scalars['numeric']['input']>;
};

/** aggregate max on columns */
export type billingItemsMaxFields = {
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
export type billingItemsMaxOrderBy = {
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
export type billingItemsMinFields = {
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
export type billingItemsMinOrderBy = {
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
export type billingItemsMutationResponse = {
  __typename?: 'billingItemsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<billingItems>;
};

/** on_conflict condition type for table "billing_items" */
export type billingItemsOnConflict = {
  constraint: billingItemsConstraint;
  updateColumns?: Array<billingItemsUpdateColumn>;
  where?: InputMaybe<billingItemsBoolExp>;
};

/** Ordering options when selecting data from "billing_items". */
export type billingItemsOrderBy = {
  amount?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  invoiceId?: InputMaybe<OrderBy>;
  payrollId?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  relatedPayroll?: InputMaybe<payrollsOrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: billing_items */
export type billingItemsPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "billing_items" */
export type billingItemsSelectColumn =
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
  | 'unitPrice';

/** input type for updating data in table "billing_items" */
export type billingItemsSetInput = {
  createdAt?: InputMaybe<Scalars['timestamp']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  invoiceId?: InputMaybe<Scalars['uuid']['input']>;
  payrollId?: InputMaybe<Scalars['uuid']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  unitPrice?: InputMaybe<Scalars['numeric']['input']>;
};

/** aggregate stddev on columns */
export type billingItemsStddevFields = {
  __typename?: 'billingItemsStddevFields';
  amount?: Maybe<Scalars['Float']['output']>;
  quantity?: Maybe<Scalars['Float']['output']>;
  unitPrice?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "billing_items" */
export type billingItemsStddevOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
};

/** aggregate stddevPop on columns */
export type billingItemsStddevPopFields = {
  __typename?: 'billingItemsStddevPopFields';
  amount?: Maybe<Scalars['Float']['output']>;
  quantity?: Maybe<Scalars['Float']['output']>;
  unitPrice?: Maybe<Scalars['Float']['output']>;
};

/** order by stddevPop() on columns of table "billing_items" */
export type billingItemsStddevPopOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
};

/** aggregate stddevSamp on columns */
export type billingItemsStddevSampFields = {
  __typename?: 'billingItemsStddevSampFields';
  amount?: Maybe<Scalars['Float']['output']>;
  quantity?: Maybe<Scalars['Float']['output']>;
  unitPrice?: Maybe<Scalars['Float']['output']>;
};

/** order by stddevSamp() on columns of table "billing_items" */
export type billingItemsStddevSampOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
};

/** Streaming cursor of the table "billingItems" */
export type billingItemsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: billingItemsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type billingItemsStreamCursorValueInput = {
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
export type billingItemsSumFields = {
  __typename?: 'billingItemsSumFields';
  amount?: Maybe<Scalars['numeric']['output']>;
  quantity?: Maybe<Scalars['Int']['output']>;
  unitPrice?: Maybe<Scalars['numeric']['output']>;
};

/** order by sum() on columns of table "billing_items" */
export type billingItemsSumOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
};

/** update columns of table "billing_items" */
export type billingItemsUpdateColumn =
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
  | 'unitPrice';

export type billingItemsUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<billingItemsIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<billingItemsSetInput>;
  /** filter the rows which have to be updated */
  where: billingItemsBoolExp;
};

/** aggregate varPop on columns */
export type billingItemsVarPopFields = {
  __typename?: 'billingItemsVarPopFields';
  amount?: Maybe<Scalars['Float']['output']>;
  quantity?: Maybe<Scalars['Float']['output']>;
  unitPrice?: Maybe<Scalars['Float']['output']>;
};

/** order by varPop() on columns of table "billing_items" */
export type billingItemsVarPopOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
};

/** aggregate varSamp on columns */
export type billingItemsVarSampFields = {
  __typename?: 'billingItemsVarSampFields';
  amount?: Maybe<Scalars['Float']['output']>;
  quantity?: Maybe<Scalars['Float']['output']>;
  unitPrice?: Maybe<Scalars['Float']['output']>;
};

/** order by varSamp() on columns of table "billing_items" */
export type billingItemsVarSampOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
};

/** aggregate variance on columns */
export type billingItemsVarianceFields = {
  __typename?: 'billingItemsVarianceFields';
  amount?: Maybe<Scalars['Float']['output']>;
  quantity?: Maybe<Scalars['Float']['output']>;
  unitPrice?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "billing_items" */
export type billingItemsVarianceOrderBy = {
  amount?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
};

/** columns and relationships of "billing_plan" */
export type billingPlans = {
  __typename?: 'billingPlans';
  /** An array relationship */
  clientBillingAssignments: Array<clientBillingAssignments>;
  /** An aggregate relationship */
  clientBillingAssignmentsAggregate: clientBillingAssignmentsAggregate;
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  currency: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['uuid']['output'];
  name: Scalars['String']['output'];
  ratePerPayroll: Scalars['numeric']['output'];
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};


/** columns and relationships of "billing_plan" */
export type billingPlansclientBillingAssignmentsArgs = {
  distinctOn?: InputMaybe<Array<clientBillingAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<clientBillingAssignmentsOrderBy>>;
  where?: InputMaybe<clientBillingAssignmentsBoolExp>;
};


/** columns and relationships of "billing_plan" */
export type billingPlansclientBillingAssignmentsAggregateArgs = {
  distinctOn?: InputMaybe<Array<clientBillingAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<clientBillingAssignmentsOrderBy>>;
  where?: InputMaybe<clientBillingAssignmentsBoolExp>;
};

/** aggregated selection of "billing_plan" */
export type billingPlansAggregate = {
  __typename?: 'billingPlansAggregate';
  aggregate?: Maybe<billingPlansAggregateFields>;
  nodes: Array<billingPlans>;
};

/** aggregate fields of "billing_plan" */
export type billingPlansAggregateFields = {
  __typename?: 'billingPlansAggregateFields';
  avg?: Maybe<billingPlansAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<billingPlansMaxFields>;
  min?: Maybe<billingPlansMinFields>;
  stddev?: Maybe<billingPlansStddevFields>;
  stddevPop?: Maybe<billingPlansStddevPopFields>;
  stddevSamp?: Maybe<billingPlansStddevSampFields>;
  sum?: Maybe<billingPlansSumFields>;
  varPop?: Maybe<billingPlansVarPopFields>;
  varSamp?: Maybe<billingPlansVarSampFields>;
  variance?: Maybe<billingPlansVarianceFields>;
};


/** aggregate fields of "billing_plan" */
export type billingPlansAggregateFieldscountArgs = {
  columns?: InputMaybe<Array<billingPlansSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type billingPlansAvgFields = {
  __typename?: 'billingPlansAvgFields';
  ratePerPayroll?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "billing_plan". All fields are combined with a logical 'AND'. */
export type billingPlansBoolExp = {
  _and?: InputMaybe<Array<billingPlansBoolExp>>;
  _not?: InputMaybe<billingPlansBoolExp>;
  _or?: InputMaybe<Array<billingPlansBoolExp>>;
  clientBillingAssignments?: InputMaybe<clientBillingAssignmentsBoolExp>;
  clientBillingAssignmentsAggregate?: InputMaybe<clientBillingAssignmentsAggregateBoolExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  currency?: InputMaybe<StringComparisonExp>;
  description?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  ratePerPayroll?: InputMaybe<NumericComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "billing_plan" */
export type billingPlansConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'billing_plan_pkey';

/** input type for incrementing numeric columns in table "billing_plan" */
export type billingPlansIncInput = {
  ratePerPayroll?: InputMaybe<Scalars['numeric']['input']>;
};

/** input type for inserting data into table "billing_plan" */
export type billingPlansInsertInput = {
  clientBillingAssignments?: InputMaybe<clientBillingAssignmentsArrRelInsertInput>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  ratePerPayroll?: InputMaybe<Scalars['numeric']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type billingPlansMaxFields = {
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
export type billingPlansMinFields = {
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
export type billingPlansMutationResponse = {
  __typename?: 'billingPlansMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<billingPlans>;
};

/** input type for inserting object relation for remote table "billing_plan" */
export type billingPlansObjRelInsertInput = {
  data: billingPlansInsertInput;
  /** upsert condition */
  onConflict?: InputMaybe<billingPlansOnConflict>;
};

/** on_conflict condition type for table "billing_plan" */
export type billingPlansOnConflict = {
  constraint: billingPlansConstraint;
  updateColumns?: Array<billingPlansUpdateColumn>;
  where?: InputMaybe<billingPlansBoolExp>;
};

/** Ordering options when selecting data from "billing_plan". */
export type billingPlansOrderBy = {
  clientBillingAssignmentsAggregate?: InputMaybe<clientBillingAssignmentsAggregateOrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  currency?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  ratePerPayroll?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: billing_plan */
export type billingPlansPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "billing_plan" */
export type billingPlansSelectColumn =
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
  | 'updatedAt';

/** input type for updating data in table "billing_plan" */
export type billingPlansSetInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  ratePerPayroll?: InputMaybe<Scalars['numeric']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type billingPlansStddevFields = {
  __typename?: 'billingPlansStddevFields';
  ratePerPayroll?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddevPop on columns */
export type billingPlansStddevPopFields = {
  __typename?: 'billingPlansStddevPopFields';
  ratePerPayroll?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddevSamp on columns */
export type billingPlansStddevSampFields = {
  __typename?: 'billingPlansStddevSampFields';
  ratePerPayroll?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "billingPlans" */
export type billingPlansStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: billingPlansStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type billingPlansStreamCursorValueInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  ratePerPayroll?: InputMaybe<Scalars['numeric']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type billingPlansSumFields = {
  __typename?: 'billingPlansSumFields';
  ratePerPayroll?: Maybe<Scalars['numeric']['output']>;
};

/** update columns of table "billing_plan" */
export type billingPlansUpdateColumn =
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
  | 'updatedAt';

export type billingPlansUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<billingPlansIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<billingPlansSetInput>;
  /** filter the rows which have to be updated */
  where: billingPlansBoolExp;
};

/** aggregate varPop on columns */
export type billingPlansVarPopFields = {
  __typename?: 'billingPlansVarPopFields';
  ratePerPayroll?: Maybe<Scalars['Float']['output']>;
};

/** aggregate varSamp on columns */
export type billingPlansVarSampFields = {
  __typename?: 'billingPlansVarSampFields';
  ratePerPayroll?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type billingPlansVarianceFields = {
  __typename?: 'billingPlansVarianceFields';
  ratePerPayroll?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "client_billing_assignment" */
export type clientBillingAssignments = {
  __typename?: 'clientBillingAssignments';
  /** An object relationship */
  assignedBillingPlan: billingPlans;
  /** An object relationship */
  assignedClient: clients;
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
export type clientBillingAssignmentsAggregate = {
  __typename?: 'clientBillingAssignmentsAggregate';
  aggregate?: Maybe<clientBillingAssignmentsAggregateFields>;
  nodes: Array<clientBillingAssignments>;
};

export type clientBillingAssignmentsAggregateBoolExp = {
  bool_and?: InputMaybe<clientBillingAssignmentsAggregateBoolExpBool_and>;
  bool_or?: InputMaybe<clientBillingAssignmentsAggregateBoolExpBool_or>;
  count?: InputMaybe<clientBillingAssignmentsAggregateBoolExpCount>;
};

export type clientBillingAssignmentsAggregateBoolExpBool_and = {
  arguments: clientBillingAssignmentsSelectColumnClientBillingAssignmentsAggregateBoolExpBool_andArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<clientBillingAssignmentsBoolExp>;
  predicate: BooleanComparisonExp;
};

export type clientBillingAssignmentsAggregateBoolExpBool_or = {
  arguments: clientBillingAssignmentsSelectColumnClientBillingAssignmentsAggregateBoolExpBool_orArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<clientBillingAssignmentsBoolExp>;
  predicate: BooleanComparisonExp;
};

export type clientBillingAssignmentsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<clientBillingAssignmentsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<clientBillingAssignmentsBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "client_billing_assignment" */
export type clientBillingAssignmentsAggregateFields = {
  __typename?: 'clientBillingAssignmentsAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<clientBillingAssignmentsMaxFields>;
  min?: Maybe<clientBillingAssignmentsMinFields>;
};


/** aggregate fields of "client_billing_assignment" */
export type clientBillingAssignmentsAggregateFieldscountArgs = {
  columns?: InputMaybe<Array<clientBillingAssignmentsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "client_billing_assignment" */
export type clientBillingAssignmentsAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<clientBillingAssignmentsMaxOrderBy>;
  min?: InputMaybe<clientBillingAssignmentsMinOrderBy>;
};

/** input type for inserting array relation for remote table "client_billing_assignment" */
export type clientBillingAssignmentsArrRelInsertInput = {
  data: Array<clientBillingAssignmentsInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<clientBillingAssignmentsOnConflict>;
};

/** Boolean expression to filter rows from the table "client_billing_assignment". All fields are combined with a logical 'AND'. */
export type clientBillingAssignmentsBoolExp = {
  _and?: InputMaybe<Array<clientBillingAssignmentsBoolExp>>;
  _not?: InputMaybe<clientBillingAssignmentsBoolExp>;
  _or?: InputMaybe<Array<clientBillingAssignmentsBoolExp>>;
  assignedBillingPlan?: InputMaybe<billingPlansBoolExp>;
  assignedClient?: InputMaybe<clientsBoolExp>;
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
export type clientBillingAssignmentsConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'client_billing_assignment_pkey';

/** input type for inserting data into table "client_billing_assignment" */
export type clientBillingAssignmentsInsertInput = {
  assignedBillingPlan?: InputMaybe<billingPlansObjRelInsertInput>;
  assignedClient?: InputMaybe<clientsObjRelInsertInput>;
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
export type clientBillingAssignmentsMaxFields = {
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
export type clientBillingAssignmentsMaxOrderBy = {
  billingPlanId?: InputMaybe<OrderBy>;
  clientId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  endDate?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  startDate?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type clientBillingAssignmentsMinFields = {
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
export type clientBillingAssignmentsMinOrderBy = {
  billingPlanId?: InputMaybe<OrderBy>;
  clientId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  endDate?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  startDate?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "client_billing_assignment" */
export type clientBillingAssignmentsMutationResponse = {
  __typename?: 'clientBillingAssignmentsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<clientBillingAssignments>;
};

/** on_conflict condition type for table "client_billing_assignment" */
export type clientBillingAssignmentsOnConflict = {
  constraint: clientBillingAssignmentsConstraint;
  updateColumns?: Array<clientBillingAssignmentsUpdateColumn>;
  where?: InputMaybe<clientBillingAssignmentsBoolExp>;
};

/** Ordering options when selecting data from "client_billing_assignment". */
export type clientBillingAssignmentsOrderBy = {
  assignedBillingPlan?: InputMaybe<billingPlansOrderBy>;
  assignedClient?: InputMaybe<clientsOrderBy>;
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
export type clientBillingAssignmentsPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "client_billing_assignment" */
export type clientBillingAssignmentsSelectColumn =
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
  | 'updatedAt';

/** select "clientBillingAssignmentsAggregateBoolExpBool_andArgumentsColumns" columns of table "client_billing_assignment" */
export type clientBillingAssignmentsSelectColumnClientBillingAssignmentsAggregateBoolExpBool_andArgumentsColumns =
  /** column name */
  | 'isActive';

/** select "clientBillingAssignmentsAggregateBoolExpBool_orArgumentsColumns" columns of table "client_billing_assignment" */
export type clientBillingAssignmentsSelectColumnClientBillingAssignmentsAggregateBoolExpBool_orArgumentsColumns =
  /** column name */
  | 'isActive';

/** input type for updating data in table "client_billing_assignment" */
export type clientBillingAssignmentsSetInput = {
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
export type clientBillingAssignmentsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: clientBillingAssignmentsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type clientBillingAssignmentsStreamCursorValueInput = {
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
export type clientBillingAssignmentsUpdateColumn =
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
  | 'updatedAt';

export type clientBillingAssignmentsUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<clientBillingAssignmentsSetInput>;
  /** filter the rows which have to be updated */
  where: clientBillingAssignmentsBoolExp;
};

/** columns and relationships of "client_external_systems" */
export type clientExternalSystems = {
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
  linkedClient: clients;
  /** An object relationship */
  linkedExternalSystem: externalSystems;
  /** Client identifier in the external system */
  systemClientId?: Maybe<Scalars['String']['output']>;
  /** Timestamp when the mapping was last updated */
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregated selection of "client_external_systems" */
export type clientExternalSystemsAggregate = {
  __typename?: 'clientExternalSystemsAggregate';
  aggregate?: Maybe<clientExternalSystemsAggregateFields>;
  nodes: Array<clientExternalSystems>;
};

export type clientExternalSystemsAggregateBoolExp = {
  count?: InputMaybe<clientExternalSystemsAggregateBoolExpCount>;
};

export type clientExternalSystemsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<clientExternalSystemsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<clientExternalSystemsBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "client_external_systems" */
export type clientExternalSystemsAggregateFields = {
  __typename?: 'clientExternalSystemsAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<clientExternalSystemsMaxFields>;
  min?: Maybe<clientExternalSystemsMinFields>;
};


/** aggregate fields of "client_external_systems" */
export type clientExternalSystemsAggregateFieldscountArgs = {
  columns?: InputMaybe<Array<clientExternalSystemsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "client_external_systems" */
export type clientExternalSystemsAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<clientExternalSystemsMaxOrderBy>;
  min?: InputMaybe<clientExternalSystemsMinOrderBy>;
};

/** input type for inserting array relation for remote table "client_external_systems" */
export type clientExternalSystemsArrRelInsertInput = {
  data: Array<clientExternalSystemsInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<clientExternalSystemsOnConflict>;
};

/** Boolean expression to filter rows from the table "client_external_systems". All fields are combined with a logical 'AND'. */
export type clientExternalSystemsBoolExp = {
  _and?: InputMaybe<Array<clientExternalSystemsBoolExp>>;
  _not?: InputMaybe<clientExternalSystemsBoolExp>;
  _or?: InputMaybe<Array<clientExternalSystemsBoolExp>>;
  clientId?: InputMaybe<UuidComparisonExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  externalSystemId?: InputMaybe<UuidComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  linkedClient?: InputMaybe<clientsBoolExp>;
  linkedExternalSystem?: InputMaybe<externalSystemsBoolExp>;
  systemClientId?: InputMaybe<StringComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "client_external_systems" */
export type clientExternalSystemsConstraint =
  /** unique or primary key constraint on columns "client_id", "system_id" */
  | 'client_external_systems_client_id_system_id_key'
  /** unique or primary key constraint on columns "id" */
  | 'client_external_systems_pkey';

/** input type for inserting data into table "client_external_systems" */
export type clientExternalSystemsInsertInput = {
  /** Reference to the client */
  clientId?: InputMaybe<Scalars['uuid']['input']>;
  /** Timestamp when the mapping was created */
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Reference to the external system */
  externalSystemId?: InputMaybe<Scalars['uuid']['input']>;
  /** Unique identifier for the client-system mapping */
  id?: InputMaybe<Scalars['uuid']['input']>;
  linkedClient?: InputMaybe<clientsObjRelInsertInput>;
  linkedExternalSystem?: InputMaybe<externalSystemsObjRelInsertInput>;
  /** Client identifier in the external system */
  systemClientId?: InputMaybe<Scalars['String']['input']>;
  /** Timestamp when the mapping was last updated */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type clientExternalSystemsMaxFields = {
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
export type clientExternalSystemsMaxOrderBy = {
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
export type clientExternalSystemsMinFields = {
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
export type clientExternalSystemsMinOrderBy = {
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
export type clientExternalSystemsMutationResponse = {
  __typename?: 'clientExternalSystemsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<clientExternalSystems>;
};

/** on_conflict condition type for table "client_external_systems" */
export type clientExternalSystemsOnConflict = {
  constraint: clientExternalSystemsConstraint;
  updateColumns?: Array<clientExternalSystemsUpdateColumn>;
  where?: InputMaybe<clientExternalSystemsBoolExp>;
};

/** Ordering options when selecting data from "client_external_systems". */
export type clientExternalSystemsOrderBy = {
  clientId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  externalSystemId?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  linkedClient?: InputMaybe<clientsOrderBy>;
  linkedExternalSystem?: InputMaybe<externalSystemsOrderBy>;
  systemClientId?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: client_external_systems */
export type clientExternalSystemsPkColumnsInput = {
  /** Unique identifier for the client-system mapping */
  id: Scalars['uuid']['input'];
};

/** select columns of table "client_external_systems" */
export type clientExternalSystemsSelectColumn =
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
  | 'updatedAt';

/** input type for updating data in table "client_external_systems" */
export type clientExternalSystemsSetInput = {
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
export type clientExternalSystemsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: clientExternalSystemsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type clientExternalSystemsStreamCursorValueInput = {
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
export type clientExternalSystemsUpdateColumn =
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
  | 'updatedAt';

export type clientExternalSystemsUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<clientExternalSystemsSetInput>;
  /** filter the rows which have to be updated */
  where: clientExternalSystemsBoolExp;
};

/** columns and relationships of "clients" */
export type clients = {
  __typename?: 'clients';
  /** Whether the client is currently active */
  active?: Maybe<Scalars['Boolean']['output']>;
  /** An array relationship */
  billingAssignments: Array<clientBillingAssignments>;
  /** An aggregate relationship */
  billingAssignmentsAggregate: clientBillingAssignmentsAggregate;
  /** An aggregate relationship */
  billingInvoicesAggregate: billingInvoiceAggregate;
  /** An array relationship */
  billing_invoices: Array<billingInvoice>;
  /** Email address for the client contact */
  contactEmail?: Maybe<Scalars['String']['output']>;
  /** Primary contact person at the client */
  contactPerson?: Maybe<Scalars['String']['output']>;
  /** Phone number for the client contact */
  contactPhone?: Maybe<Scalars['String']['output']>;
  /** Timestamp when the client was created */
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  /** An array relationship */
  externalSystems: Array<clientExternalSystems>;
  /** An aggregate relationship */
  externalSystemsAggregate: clientExternalSystemsAggregate;
  /** Unique identifier for the client */
  id: Scalars['uuid']['output'];
  /** Client company name */
  name: Scalars['String']['output'];
  /** An array relationship */
  payrolls: Array<payrolls>;
  /** An aggregate relationship */
  payrollsAggregate: payrollsAggregate;
  /** Timestamp when the client was last updated */
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};


/** columns and relationships of "clients" */
export type clientsbillingAssignmentsArgs = {
  distinctOn?: InputMaybe<Array<clientBillingAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<clientBillingAssignmentsOrderBy>>;
  where?: InputMaybe<clientBillingAssignmentsBoolExp>;
};


/** columns and relationships of "clients" */
export type clientsbillingAssignmentsAggregateArgs = {
  distinctOn?: InputMaybe<Array<clientBillingAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<clientBillingAssignmentsOrderBy>>;
  where?: InputMaybe<clientBillingAssignmentsBoolExp>;
};


/** columns and relationships of "clients" */
export type clientsbillingInvoicesAggregateArgs = {
  distinctOn?: InputMaybe<Array<billingInvoiceSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<billingInvoiceOrderBy>>;
  where?: InputMaybe<billingInvoiceBoolExp>;
};


/** columns and relationships of "clients" */
export type clientsbilling_invoicesArgs = {
  distinctOn?: InputMaybe<Array<billingInvoiceSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<billingInvoiceOrderBy>>;
  where?: InputMaybe<billingInvoiceBoolExp>;
};


/** columns and relationships of "clients" */
export type clientsexternalSystemsArgs = {
  distinctOn?: InputMaybe<Array<clientExternalSystemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<clientExternalSystemsOrderBy>>;
  where?: InputMaybe<clientExternalSystemsBoolExp>;
};


/** columns and relationships of "clients" */
export type clientsexternalSystemsAggregateArgs = {
  distinctOn?: InputMaybe<Array<clientExternalSystemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<clientExternalSystemsOrderBy>>;
  where?: InputMaybe<clientExternalSystemsBoolExp>;
};


/** columns and relationships of "clients" */
export type clientspayrollsArgs = {
  distinctOn?: InputMaybe<Array<payrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollsOrderBy>>;
  where?: InputMaybe<payrollsBoolExp>;
};


/** columns and relationships of "clients" */
export type clientspayrollsAggregateArgs = {
  distinctOn?: InputMaybe<Array<payrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollsOrderBy>>;
  where?: InputMaybe<payrollsBoolExp>;
};

/** aggregated selection of "clients" */
export type clientsAggregate = {
  __typename?: 'clientsAggregate';
  aggregate?: Maybe<clientsAggregateFields>;
  nodes: Array<clients>;
};

export type clientsAggregateBoolExp = {
  bool_and?: InputMaybe<clientsAggregateBoolExpBool_and>;
  bool_or?: InputMaybe<clientsAggregateBoolExpBool_or>;
  count?: InputMaybe<clientsAggregateBoolExpCount>;
};

export type clientsAggregateBoolExpBool_and = {
  arguments: clientsSelectColumnClientsAggregateBoolExpBool_andArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<clientsBoolExp>;
  predicate: BooleanComparisonExp;
};

export type clientsAggregateBoolExpBool_or = {
  arguments: clientsSelectColumnClientsAggregateBoolExpBool_orArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<clientsBoolExp>;
  predicate: BooleanComparisonExp;
};

export type clientsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<clientsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<clientsBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "clients" */
export type clientsAggregateFields = {
  __typename?: 'clientsAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<clientsMaxFields>;
  min?: Maybe<clientsMinFields>;
};


/** aggregate fields of "clients" */
export type clientsAggregateFieldscountArgs = {
  columns?: InputMaybe<Array<clientsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "clients" */
export type clientsAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<clientsMaxOrderBy>;
  min?: InputMaybe<clientsMinOrderBy>;
};

/** input type for inserting array relation for remote table "clients" */
export type clientsArrRelInsertInput = {
  data: Array<clientsInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<clientsOnConflict>;
};

/** Boolean expression to filter rows from the table "clients". All fields are combined with a logical 'AND'. */
export type clientsBoolExp = {
  _and?: InputMaybe<Array<clientsBoolExp>>;
  _not?: InputMaybe<clientsBoolExp>;
  _or?: InputMaybe<Array<clientsBoolExp>>;
  active?: InputMaybe<BooleanComparisonExp>;
  billingAssignments?: InputMaybe<clientBillingAssignmentsBoolExp>;
  billingAssignmentsAggregate?: InputMaybe<clientBillingAssignmentsAggregateBoolExp>;
  billing_invoices?: InputMaybe<billingInvoiceBoolExp>;
  billing_invoicesAggregate?: InputMaybe<billingInvoiceAggregateBoolExp>;
  contactEmail?: InputMaybe<StringComparisonExp>;
  contactPerson?: InputMaybe<StringComparisonExp>;
  contactPhone?: InputMaybe<StringComparisonExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  externalSystems?: InputMaybe<clientExternalSystemsBoolExp>;
  externalSystemsAggregate?: InputMaybe<clientExternalSystemsAggregateBoolExp>;
  id?: InputMaybe<UuidComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  payrolls?: InputMaybe<payrollsBoolExp>;
  payrollsAggregate?: InputMaybe<payrollsAggregateBoolExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "clients" */
export type clientsConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'clients_pkey';

/** input type for inserting data into table "clients" */
export type clientsInsertInput = {
  /** Whether the client is currently active */
  active?: InputMaybe<Scalars['Boolean']['input']>;
  billingAssignments?: InputMaybe<clientBillingAssignmentsArrRelInsertInput>;
  billing_invoices?: InputMaybe<billingInvoiceArrRelInsertInput>;
  /** Email address for the client contact */
  contactEmail?: InputMaybe<Scalars['String']['input']>;
  /** Primary contact person at the client */
  contactPerson?: InputMaybe<Scalars['String']['input']>;
  /** Phone number for the client contact */
  contactPhone?: InputMaybe<Scalars['String']['input']>;
  /** Timestamp when the client was created */
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  externalSystems?: InputMaybe<clientExternalSystemsArrRelInsertInput>;
  /** Unique identifier for the client */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Client company name */
  name?: InputMaybe<Scalars['String']['input']>;
  payrolls?: InputMaybe<payrollsArrRelInsertInput>;
  /** Timestamp when the client was last updated */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type clientsMaxFields = {
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
export type clientsMaxOrderBy = {
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
export type clientsMinFields = {
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
export type clientsMinOrderBy = {
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
export type clientsMutationResponse = {
  __typename?: 'clientsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<clients>;
};

/** input type for inserting object relation for remote table "clients" */
export type clientsObjRelInsertInput = {
  data: clientsInsertInput;
  /** upsert condition */
  onConflict?: InputMaybe<clientsOnConflict>;
};

/** on_conflict condition type for table "clients" */
export type clientsOnConflict = {
  constraint: clientsConstraint;
  updateColumns?: Array<clientsUpdateColumn>;
  where?: InputMaybe<clientsBoolExp>;
};

/** Ordering options when selecting data from "clients". */
export type clientsOrderBy = {
  active?: InputMaybe<OrderBy>;
  billingAssignmentsAggregate?: InputMaybe<clientBillingAssignmentsAggregateOrderBy>;
  billing_invoicesAggregate?: InputMaybe<billingInvoiceAggregateOrderBy>;
  contactEmail?: InputMaybe<OrderBy>;
  contactPerson?: InputMaybe<OrderBy>;
  contactPhone?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  externalSystemsAggregate?: InputMaybe<clientExternalSystemsAggregateOrderBy>;
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  payrollsAggregate?: InputMaybe<payrollsAggregateOrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: clients */
export type clientsPkColumnsInput = {
  /** Unique identifier for the client */
  id: Scalars['uuid']['input'];
};

/** select columns of table "clients" */
export type clientsSelectColumn =
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
  | 'updatedAt';

/** select "clientsAggregateBoolExpBool_andArgumentsColumns" columns of table "clients" */
export type clientsSelectColumnClientsAggregateBoolExpBool_andArgumentsColumns =
  /** column name */
  | 'active';

/** select "clientsAggregateBoolExpBool_orArgumentsColumns" columns of table "clients" */
export type clientsSelectColumnClientsAggregateBoolExpBool_orArgumentsColumns =
  /** column name */
  | 'active';

/** input type for updating data in table "clients" */
export type clientsSetInput = {
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
export type clientsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: clientsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type clientsStreamCursorValueInput = {
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
export type clientsUpdateColumn =
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
  | 'updatedAt';

export type clientsUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<clientsSetInput>;
  /** filter the rows which have to be updated */
  where: clientsBoolExp;
};

export type createPayrollVersionArgs = {
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

export type createPayrollVersionSimpleArgs = {
  payroll_id?: InputMaybe<Scalars['uuid']['input']>;
  version_reason?: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "current_payrolls" */
export type currentPayrolls = {
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
export type currentPayrollsAggregate = {
  __typename?: 'currentPayrollsAggregate';
  aggregate?: Maybe<currentPayrollsAggregateFields>;
  nodes: Array<currentPayrolls>;
};

/** aggregate fields of "current_payrolls" */
export type currentPayrollsAggregateFields = {
  __typename?: 'currentPayrollsAggregateFields';
  avg?: Maybe<currentPayrollsAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<currentPayrollsMaxFields>;
  min?: Maybe<currentPayrollsMinFields>;
  stddev?: Maybe<currentPayrollsStddevFields>;
  stddevPop?: Maybe<currentPayrollsStddevPopFields>;
  stddevSamp?: Maybe<currentPayrollsStddevSampFields>;
  sum?: Maybe<currentPayrollsSumFields>;
  varPop?: Maybe<currentPayrollsVarPopFields>;
  varSamp?: Maybe<currentPayrollsVarSampFields>;
  variance?: Maybe<currentPayrollsVarianceFields>;
};


/** aggregate fields of "current_payrolls" */
export type currentPayrollsAggregateFieldscountArgs = {
  columns?: InputMaybe<Array<currentPayrollsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type currentPayrollsAvgFields = {
  __typename?: 'currentPayrollsAvgFields';
  dateValue?: Maybe<Scalars['Float']['output']>;
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "current_payrolls". All fields are combined with a logical 'AND'. */
export type currentPayrollsBoolExp = {
  _and?: InputMaybe<Array<currentPayrollsBoolExp>>;
  _not?: InputMaybe<currentPayrollsBoolExp>;
  _or?: InputMaybe<Array<currentPayrollsBoolExp>>;
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
export type currentPayrollsMaxFields = {
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
export type currentPayrollsMinFields = {
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
export type currentPayrollsOrderBy = {
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
export type currentPayrollsSelectColumn =
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
  | 'versionReason';

/** aggregate stddev on columns */
export type currentPayrollsStddevFields = {
  __typename?: 'currentPayrollsStddevFields';
  dateValue?: Maybe<Scalars['Float']['output']>;
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddevPop on columns */
export type currentPayrollsStddevPopFields = {
  __typename?: 'currentPayrollsStddevPopFields';
  dateValue?: Maybe<Scalars['Float']['output']>;
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddevSamp on columns */
export type currentPayrollsStddevSampFields = {
  __typename?: 'currentPayrollsStddevSampFields';
  dateValue?: Maybe<Scalars['Float']['output']>;
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "currentPayrolls" */
export type currentPayrollsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: currentPayrollsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type currentPayrollsStreamCursorValueInput = {
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
export type currentPayrollsSumFields = {
  __typename?: 'currentPayrollsSumFields';
  dateValue?: Maybe<Scalars['Int']['output']>;
  versionNumber?: Maybe<Scalars['Int']['output']>;
};

/** aggregate varPop on columns */
export type currentPayrollsVarPopFields = {
  __typename?: 'currentPayrollsVarPopFields';
  dateValue?: Maybe<Scalars['Float']['output']>;
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** aggregate varSamp on columns */
export type currentPayrollsVarSampFields = {
  __typename?: 'currentPayrollsVarSampFields';
  dateValue?: Maybe<Scalars['Float']['output']>;
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type currentPayrollsVarianceFields = {
  __typename?: 'currentPayrollsVarianceFields';
  dateValue?: Maybe<Scalars['Float']['output']>;
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "audit.data_access_log" */
export type dataAccessLogs = {
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
export type dataAccessLogsmetadataArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "audit.data_access_log" */
export type dataAccessLogsAggregate = {
  __typename?: 'dataAccessLogsAggregate';
  aggregate?: Maybe<dataAccessLogsAggregateFields>;
  nodes: Array<dataAccessLogs>;
};

/** aggregate fields of "audit.data_access_log" */
export type dataAccessLogsAggregateFields = {
  __typename?: 'dataAccessLogsAggregateFields';
  avg?: Maybe<dataAccessLogsAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<dataAccessLogsMaxFields>;
  min?: Maybe<dataAccessLogsMinFields>;
  stddev?: Maybe<dataAccessLogsStddevFields>;
  stddevPop?: Maybe<dataAccessLogsStddevPopFields>;
  stddevSamp?: Maybe<dataAccessLogsStddevSampFields>;
  sum?: Maybe<dataAccessLogsSumFields>;
  varPop?: Maybe<dataAccessLogsVarPopFields>;
  varSamp?: Maybe<dataAccessLogsVarSampFields>;
  variance?: Maybe<dataAccessLogsVarianceFields>;
};


/** aggregate fields of "audit.data_access_log" */
export type dataAccessLogsAggregateFieldscountArgs = {
  columns?: InputMaybe<Array<dataAccessLogsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type dataAccessLogsAppendInput = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
};

/** aggregate avg on columns */
export type dataAccessLogsAvgFields = {
  __typename?: 'dataAccessLogsAvgFields';
  rowCount?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "audit.data_access_log". All fields are combined with a logical 'AND'. */
export type dataAccessLogsBoolExp = {
  _and?: InputMaybe<Array<dataAccessLogsBoolExp>>;
  _not?: InputMaybe<dataAccessLogsBoolExp>;
  _or?: InputMaybe<Array<dataAccessLogsBoolExp>>;
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
export type dataAccessLogsConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'data_access_log_pkey';

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type dataAccessLogsDeleteAtPathInput = {
  metadata?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type dataAccessLogsDeleteElemInput = {
  metadata?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type dataAccessLogsDeleteKeyInput = {
  metadata?: InputMaybe<Scalars['String']['input']>;
};

/** input type for incrementing numeric columns in table "audit.data_access_log" */
export type dataAccessLogsIncInput = {
  rowCount?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "audit.data_access_log" */
export type dataAccessLogsInsertInput = {
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
export type dataAccessLogsMaxFields = {
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
export type dataAccessLogsMinFields = {
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
export type dataAccessLogsMutationResponse = {
  __typename?: 'dataAccessLogsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<dataAccessLogs>;
};

/** on_conflict condition type for table "audit.data_access_log" */
export type dataAccessLogsOnConflict = {
  constraint: dataAccessLogsConstraint;
  updateColumns?: Array<dataAccessLogsUpdateColumn>;
  where?: InputMaybe<dataAccessLogsBoolExp>;
};

/** Ordering options when selecting data from "audit.data_access_log". */
export type dataAccessLogsOrderBy = {
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
export type dataAccessLogsPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type dataAccessLogsPrependInput = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "audit.data_access_log" */
export type dataAccessLogsSelectColumn =
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
  | 'userId';

/** input type for updating data in table "audit.data_access_log" */
export type dataAccessLogsSetInput = {
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
export type dataAccessLogsStddevFields = {
  __typename?: 'dataAccessLogsStddevFields';
  rowCount?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddevPop on columns */
export type dataAccessLogsStddevPopFields = {
  __typename?: 'dataAccessLogsStddevPopFields';
  rowCount?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddevSamp on columns */
export type dataAccessLogsStddevSampFields = {
  __typename?: 'dataAccessLogsStddevSampFields';
  rowCount?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "dataAccessLogs" */
export type dataAccessLogsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: dataAccessLogsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type dataAccessLogsStreamCursorValueInput = {
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
export type dataAccessLogsSumFields = {
  __typename?: 'dataAccessLogsSumFields';
  rowCount?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "audit.data_access_log" */
export type dataAccessLogsUpdateColumn =
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
  | 'userId';

export type dataAccessLogsUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<dataAccessLogsAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _deleteAtPath?: InputMaybe<dataAccessLogsDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _deleteElem?: InputMaybe<dataAccessLogsDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _deleteKey?: InputMaybe<dataAccessLogsDeleteKeyInput>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<dataAccessLogsIncInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<dataAccessLogsPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<dataAccessLogsSetInput>;
  /** filter the rows which have to be updated */
  where: dataAccessLogsBoolExp;
};

/** aggregate varPop on columns */
export type dataAccessLogsVarPopFields = {
  __typename?: 'dataAccessLogsVarPopFields';
  rowCount?: Maybe<Scalars['Float']['output']>;
};

/** aggregate varSamp on columns */
export type dataAccessLogsVarSampFields = {
  __typename?: 'dataAccessLogsVarSampFields';
  rowCount?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type dataAccessLogsVarianceFields = {
  __typename?: 'dataAccessLogsVarianceFields';
  rowCount?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "external_systems" */
export type externalSystems = {
  __typename?: 'externalSystems';
  /** An array relationship */
  clientExternalSystems: Array<clientExternalSystems>;
  /** An aggregate relationship */
  clientExternalSystemsAggregate: clientExternalSystemsAggregate;
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
export type externalSystemsclientExternalSystemsArgs = {
  distinctOn?: InputMaybe<Array<clientExternalSystemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<clientExternalSystemsOrderBy>>;
  where?: InputMaybe<clientExternalSystemsBoolExp>;
};


/** columns and relationships of "external_systems" */
export type externalSystemsclientExternalSystemsAggregateArgs = {
  distinctOn?: InputMaybe<Array<clientExternalSystemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<clientExternalSystemsOrderBy>>;
  where?: InputMaybe<clientExternalSystemsBoolExp>;
};

/** aggregated selection of "external_systems" */
export type externalSystemsAggregate = {
  __typename?: 'externalSystemsAggregate';
  aggregate?: Maybe<externalSystemsAggregateFields>;
  nodes: Array<externalSystems>;
};

/** aggregate fields of "external_systems" */
export type externalSystemsAggregateFields = {
  __typename?: 'externalSystemsAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<externalSystemsMaxFields>;
  min?: Maybe<externalSystemsMinFields>;
};


/** aggregate fields of "external_systems" */
export type externalSystemsAggregateFieldscountArgs = {
  columns?: InputMaybe<Array<externalSystemsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "external_systems". All fields are combined with a logical 'AND'. */
export type externalSystemsBoolExp = {
  _and?: InputMaybe<Array<externalSystemsBoolExp>>;
  _not?: InputMaybe<externalSystemsBoolExp>;
  _or?: InputMaybe<Array<externalSystemsBoolExp>>;
  clientExternalSystems?: InputMaybe<clientExternalSystemsBoolExp>;
  clientExternalSystemsAggregate?: InputMaybe<clientExternalSystemsAggregateBoolExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  description?: InputMaybe<StringComparisonExp>;
  icon?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
  url?: InputMaybe<StringComparisonExp>;
};

/** unique or primary key constraints on table "external_systems" */
export type externalSystemsConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'external_systems_pkey';

/** input type for inserting data into table "external_systems" */
export type externalSystemsInsertInput = {
  clientExternalSystems?: InputMaybe<clientExternalSystemsArrRelInsertInput>;
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
export type externalSystemsMaxFields = {
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
export type externalSystemsMinFields = {
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
export type externalSystemsMutationResponse = {
  __typename?: 'externalSystemsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<externalSystems>;
};

/** input type for inserting object relation for remote table "external_systems" */
export type externalSystemsObjRelInsertInput = {
  data: externalSystemsInsertInput;
  /** upsert condition */
  onConflict?: InputMaybe<externalSystemsOnConflict>;
};

/** on_conflict condition type for table "external_systems" */
export type externalSystemsOnConflict = {
  constraint: externalSystemsConstraint;
  updateColumns?: Array<externalSystemsUpdateColumn>;
  where?: InputMaybe<externalSystemsBoolExp>;
};

/** Ordering options when selecting data from "external_systems". */
export type externalSystemsOrderBy = {
  clientExternalSystemsAggregate?: InputMaybe<clientExternalSystemsAggregateOrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  icon?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  url?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: external_systems */
export type externalSystemsPkColumnsInput = {
  /** Unique identifier for the external system */
  id: Scalars['uuid']['input'];
};

/** select columns of table "external_systems" */
export type externalSystemsSelectColumn =
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
  | 'url';

/** input type for updating data in table "external_systems" */
export type externalSystemsSetInput = {
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
export type externalSystemsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: externalSystemsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type externalSystemsStreamCursorValueInput = {
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
export type externalSystemsUpdateColumn =
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
  | 'url';

export type externalSystemsUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<externalSystemsSetInput>;
  /** filter the rows which have to be updated */
  where: externalSystemsBoolExp;
};

/** columns and relationships of "feature_flags" */
export type featureFlags = {
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
export type featureFlagsallowedRolesArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "feature_flags" */
export type featureFlagsAggregate = {
  __typename?: 'featureFlagsAggregate';
  aggregate?: Maybe<featureFlagsAggregateFields>;
  nodes: Array<featureFlags>;
};

/** aggregate fields of "feature_flags" */
export type featureFlagsAggregateFields = {
  __typename?: 'featureFlagsAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<featureFlagsMaxFields>;
  min?: Maybe<featureFlagsMinFields>;
};


/** aggregate fields of "feature_flags" */
export type featureFlagsAggregateFieldscountArgs = {
  columns?: InputMaybe<Array<featureFlagsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type featureFlagsAppendInput = {
  /** JSON array of roles that can access this feature */
  allowedRoles?: InputMaybe<Scalars['jsonb']['input']>;
};

/** Boolean expression to filter rows from the table "feature_flags". All fields are combined with a logical 'AND'. */
export type featureFlagsBoolExp = {
  _and?: InputMaybe<Array<featureFlagsBoolExp>>;
  _not?: InputMaybe<featureFlagsBoolExp>;
  _or?: InputMaybe<Array<featureFlagsBoolExp>>;
  allowedRoles?: InputMaybe<JsonbComparisonExp>;
  featureName?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  isEnabled?: InputMaybe<BooleanComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "feature_flags" */
export type featureFlagsConstraint =
  /** unique or primary key constraint on columns "feature_name" */
  | 'feature_flags_feature_name_key'
  /** unique or primary key constraint on columns "id" */
  | 'feature_flags_pkey';

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type featureFlagsDeleteAtPathInput = {
  /** JSON array of roles that can access this feature */
  allowedRoles?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type featureFlagsDeleteElemInput = {
  /** JSON array of roles that can access this feature */
  allowedRoles?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type featureFlagsDeleteKeyInput = {
  /** JSON array of roles that can access this feature */
  allowedRoles?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "feature_flags" */
export type featureFlagsInsertInput = {
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
export type featureFlagsMaxFields = {
  __typename?: 'featureFlagsMaxFields';
  /** Name of the feature controlled by this flag */
  featureName?: Maybe<Scalars['String']['output']>;
  /** Unique identifier for the feature flag */
  id?: Maybe<Scalars['uuid']['output']>;
  /** Timestamp when the feature flag was last updated */
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type featureFlagsMinFields = {
  __typename?: 'featureFlagsMinFields';
  /** Name of the feature controlled by this flag */
  featureName?: Maybe<Scalars['String']['output']>;
  /** Unique identifier for the feature flag */
  id?: Maybe<Scalars['uuid']['output']>;
  /** Timestamp when the feature flag was last updated */
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "feature_flags" */
export type featureFlagsMutationResponse = {
  __typename?: 'featureFlagsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<featureFlags>;
};

/** on_conflict condition type for table "feature_flags" */
export type featureFlagsOnConflict = {
  constraint: featureFlagsConstraint;
  updateColumns?: Array<featureFlagsUpdateColumn>;
  where?: InputMaybe<featureFlagsBoolExp>;
};

/** Ordering options when selecting data from "feature_flags". */
export type featureFlagsOrderBy = {
  allowedRoles?: InputMaybe<OrderBy>;
  featureName?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  isEnabled?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: feature_flags */
export type featureFlagsPkColumnsInput = {
  /** Unique identifier for the feature flag */
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type featureFlagsPrependInput = {
  /** JSON array of roles that can access this feature */
  allowedRoles?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "feature_flags" */
export type featureFlagsSelectColumn =
  /** column name */
  | 'allowedRoles'
  /** column name */
  | 'featureName'
  /** column name */
  | 'id'
  /** column name */
  | 'isEnabled'
  /** column name */
  | 'updatedAt';

/** input type for updating data in table "feature_flags" */
export type featureFlagsSetInput = {
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
export type featureFlagsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: featureFlagsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type featureFlagsStreamCursorValueInput = {
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
export type featureFlagsUpdateColumn =
  /** column name */
  | 'allowedRoles'
  /** column name */
  | 'featureName'
  /** column name */
  | 'id'
  /** column name */
  | 'isEnabled'
  /** column name */
  | 'updatedAt';

export type featureFlagsUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<featureFlagsAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _deleteAtPath?: InputMaybe<featureFlagsDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _deleteElem?: InputMaybe<featureFlagsDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _deleteKey?: InputMaybe<featureFlagsDeleteKeyInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<featureFlagsPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<featureFlagsSetInput>;
  /** filter the rows which have to be updated */
  where: featureFlagsBoolExp;
};

export type generatePayrollDatesArgs = {
  p_end_date?: InputMaybe<Scalars['date']['input']>;
  p_max_dates?: InputMaybe<Scalars['Int']['input']>;
  p_payroll_id?: InputMaybe<Scalars['uuid']['input']>;
  p_start_date?: InputMaybe<Scalars['date']['input']>;
};

export type getLatestPayrollVersionArgs = {
  payroll_id?: InputMaybe<Scalars['uuid']['input']>;
};

export type getPayrollVersionHistoryArgs = {
  payroll_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** columns and relationships of "holidays" */
export type holidays = {
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
export type holidaysAggregate = {
  __typename?: 'holidaysAggregate';
  aggregate?: Maybe<holidaysAggregateFields>;
  nodes: Array<holidays>;
};

/** aggregate fields of "holidays" */
export type holidaysAggregateFields = {
  __typename?: 'holidaysAggregateFields';
  avg?: Maybe<holidaysAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<holidaysMaxFields>;
  min?: Maybe<holidaysMinFields>;
  stddev?: Maybe<holidaysStddevFields>;
  stddevPop?: Maybe<holidaysStddevPopFields>;
  stddevSamp?: Maybe<holidaysStddevSampFields>;
  sum?: Maybe<holidaysSumFields>;
  varPop?: Maybe<holidaysVarPopFields>;
  varSamp?: Maybe<holidaysVarSampFields>;
  variance?: Maybe<holidaysVarianceFields>;
};


/** aggregate fields of "holidays" */
export type holidaysAggregateFieldscountArgs = {
  columns?: InputMaybe<Array<holidaysSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type holidaysAvgFields = {
  __typename?: 'holidaysAvgFields';
  /** First year when the holiday was observed */
  launchYear?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "holidays". All fields are combined with a logical 'AND'. */
export type holidaysBoolExp = {
  _and?: InputMaybe<Array<holidaysBoolExp>>;
  _not?: InputMaybe<holidaysBoolExp>;
  _or?: InputMaybe<Array<holidaysBoolExp>>;
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
export type holidaysConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'holidays_pkey';

/** input type for incrementing numeric columns in table "holidays" */
export type holidaysIncInput = {
  /** First year when the holiday was observed */
  launchYear?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "holidays" */
export type holidaysInsertInput = {
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
export type holidaysMaxFields = {
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
export type holidaysMinFields = {
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
export type holidaysMutationResponse = {
  __typename?: 'holidaysMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<holidays>;
};

/** on_conflict condition type for table "holidays" */
export type holidaysOnConflict = {
  constraint: holidaysConstraint;
  updateColumns?: Array<holidaysUpdateColumn>;
  where?: InputMaybe<holidaysBoolExp>;
};

/** Ordering options when selecting data from "holidays". */
export type holidaysOrderBy = {
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
export type holidaysPkColumnsInput = {
  /** Unique identifier for the holiday */
  id: Scalars['uuid']['input'];
};

/** select columns of table "holidays" */
export type holidaysSelectColumn =
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
  | 'updatedAt';

/** input type for updating data in table "holidays" */
export type holidaysSetInput = {
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
export type holidaysStddevFields = {
  __typename?: 'holidaysStddevFields';
  /** First year when the holiday was observed */
  launchYear?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddevPop on columns */
export type holidaysStddevPopFields = {
  __typename?: 'holidaysStddevPopFields';
  /** First year when the holiday was observed */
  launchYear?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddevSamp on columns */
export type holidaysStddevSampFields = {
  __typename?: 'holidaysStddevSampFields';
  /** First year when the holiday was observed */
  launchYear?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "holidays" */
export type holidaysStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: holidaysStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type holidaysStreamCursorValueInput = {
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
export type holidaysSumFields = {
  __typename?: 'holidaysSumFields';
  /** First year when the holiday was observed */
  launchYear?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "holidays" */
export type holidaysUpdateColumn =
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
  | 'updatedAt';

export type holidaysUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<holidaysIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<holidaysSetInput>;
  /** filter the rows which have to be updated */
  where: holidaysBoolExp;
};

/** aggregate varPop on columns */
export type holidaysVarPopFields = {
  __typename?: 'holidaysVarPopFields';
  /** First year when the holiday was observed */
  launchYear?: Maybe<Scalars['Float']['output']>;
};

/** aggregate varSamp on columns */
export type holidaysVarSampFields = {
  __typename?: 'holidaysVarSampFields';
  /** First year when the holiday was observed */
  launchYear?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type holidaysVarianceFields = {
  __typename?: 'holidaysVarianceFields';
  /** First year when the holiday was observed */
  launchYear?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "latest_payroll_version_results" */
export type latestPayrollVersionResults = {
  __typename?: 'latestPayrollVersionResults';
  active: Scalars['Boolean']['output'];
  goLiveDate?: Maybe<Scalars['date']['output']>;
  id: Scalars['uuid']['output'];
  name: Scalars['String']['output'];
  payrollId: Scalars['uuid']['output'];
  queriedAt?: Maybe<Scalars['timestamptz']['output']>;
  versionNumber: Scalars['Int']['output'];
};

export type latestPayrollVersionResultsAggregate = {
  __typename?: 'latestPayrollVersionResultsAggregate';
  aggregate?: Maybe<latestPayrollVersionResultsAggregateFields>;
  nodes: Array<latestPayrollVersionResults>;
};

/** aggregate fields of "latest_payroll_version_results" */
export type latestPayrollVersionResultsAggregateFields = {
  __typename?: 'latestPayrollVersionResultsAggregateFields';
  avg?: Maybe<latestPayrollVersionResultsAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<latestPayrollVersionResultsMaxFields>;
  min?: Maybe<latestPayrollVersionResultsMinFields>;
  stddev?: Maybe<latestPayrollVersionResultsStddevFields>;
  stddevPop?: Maybe<latestPayrollVersionResultsStddevPopFields>;
  stddevSamp?: Maybe<latestPayrollVersionResultsStddevSampFields>;
  sum?: Maybe<latestPayrollVersionResultsSumFields>;
  varPop?: Maybe<latestPayrollVersionResultsVarPopFields>;
  varSamp?: Maybe<latestPayrollVersionResultsVarSampFields>;
  variance?: Maybe<latestPayrollVersionResultsVarianceFields>;
};


/** aggregate fields of "latest_payroll_version_results" */
export type latestPayrollVersionResultsAggregateFieldscountArgs = {
  columns?: InputMaybe<Array<latestPayrollVersionResultsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type latestPayrollVersionResultsAvgFields = {
  __typename?: 'latestPayrollVersionResultsAvgFields';
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "latest_payroll_version_results". All fields are combined with a logical 'AND'. */
export type latestPayrollVersionResultsBoolExp = {
  _and?: InputMaybe<Array<latestPayrollVersionResultsBoolExp>>;
  _not?: InputMaybe<latestPayrollVersionResultsBoolExp>;
  _or?: InputMaybe<Array<latestPayrollVersionResultsBoolExp>>;
  active?: InputMaybe<BooleanComparisonExp>;
  goLiveDate?: InputMaybe<DateComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  payrollId?: InputMaybe<UuidComparisonExp>;
  queriedAt?: InputMaybe<TimestamptzComparisonExp>;
  versionNumber?: InputMaybe<IntComparisonExp>;
};

/** unique or primary key constraints on table "latest_payroll_version_results" */
export type latestPayrollVersionResultsConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'latest_payroll_version_results_pkey';

/** input type for incrementing numeric columns in table "latest_payroll_version_results" */
export type latestPayrollVersionResultsIncInput = {
  versionNumber?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "latest_payroll_version_results" */
export type latestPayrollVersionResultsInsertInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  goLiveDate?: InputMaybe<Scalars['date']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  payrollId?: InputMaybe<Scalars['uuid']['input']>;
  queriedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  versionNumber?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate max on columns */
export type latestPayrollVersionResultsMaxFields = {
  __typename?: 'latestPayrollVersionResultsMaxFields';
  goLiveDate?: Maybe<Scalars['date']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  payrollId?: Maybe<Scalars['uuid']['output']>;
  queriedAt?: Maybe<Scalars['timestamptz']['output']>;
  versionNumber?: Maybe<Scalars['Int']['output']>;
};

/** aggregate min on columns */
export type latestPayrollVersionResultsMinFields = {
  __typename?: 'latestPayrollVersionResultsMinFields';
  goLiveDate?: Maybe<Scalars['date']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  payrollId?: Maybe<Scalars['uuid']['output']>;
  queriedAt?: Maybe<Scalars['timestamptz']['output']>;
  versionNumber?: Maybe<Scalars['Int']['output']>;
};

/** response of any mutation on the table "latest_payroll_version_results" */
export type latestPayrollVersionResultsMutationResponse = {
  __typename?: 'latestPayrollVersionResultsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<latestPayrollVersionResults>;
};

/** on_conflict condition type for table "latest_payroll_version_results" */
export type latestPayrollVersionResultsOnConflict = {
  constraint: latestPayrollVersionResultsConstraint;
  updateColumns?: Array<latestPayrollVersionResultsUpdateColumn>;
  where?: InputMaybe<latestPayrollVersionResultsBoolExp>;
};

/** Ordering options when selecting data from "latest_payroll_version_results". */
export type latestPayrollVersionResultsOrderBy = {
  active?: InputMaybe<OrderBy>;
  goLiveDate?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  payrollId?: InputMaybe<OrderBy>;
  queriedAt?: InputMaybe<OrderBy>;
  versionNumber?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: latest_payroll_version_results */
export type latestPayrollVersionResultsPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "latest_payroll_version_results" */
export type latestPayrollVersionResultsSelectColumn =
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
  | 'versionNumber';

/** input type for updating data in table "latest_payroll_version_results" */
export type latestPayrollVersionResultsSetInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  goLiveDate?: InputMaybe<Scalars['date']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  payrollId?: InputMaybe<Scalars['uuid']['input']>;
  queriedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  versionNumber?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate stddev on columns */
export type latestPayrollVersionResultsStddevFields = {
  __typename?: 'latestPayrollVersionResultsStddevFields';
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddevPop on columns */
export type latestPayrollVersionResultsStddevPopFields = {
  __typename?: 'latestPayrollVersionResultsStddevPopFields';
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddevSamp on columns */
export type latestPayrollVersionResultsStddevSampFields = {
  __typename?: 'latestPayrollVersionResultsStddevSampFields';
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "latestPayrollVersionResults" */
export type latestPayrollVersionResultsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: latestPayrollVersionResultsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type latestPayrollVersionResultsStreamCursorValueInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  goLiveDate?: InputMaybe<Scalars['date']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  payrollId?: InputMaybe<Scalars['uuid']['input']>;
  queriedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  versionNumber?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type latestPayrollVersionResultsSumFields = {
  __typename?: 'latestPayrollVersionResultsSumFields';
  versionNumber?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "latest_payroll_version_results" */
export type latestPayrollVersionResultsUpdateColumn =
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
  | 'versionNumber';

export type latestPayrollVersionResultsUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<latestPayrollVersionResultsIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<latestPayrollVersionResultsSetInput>;
  /** filter the rows which have to be updated */
  where: latestPayrollVersionResultsBoolExp;
};

/** aggregate varPop on columns */
export type latestPayrollVersionResultsVarPopFields = {
  __typename?: 'latestPayrollVersionResultsVarPopFields';
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** aggregate varSamp on columns */
export type latestPayrollVersionResultsVarSampFields = {
  __typename?: 'latestPayrollVersionResultsVarSampFields';
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type latestPayrollVersionResultsVarianceFields = {
  __typename?: 'latestPayrollVersionResultsVarianceFields';
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "leave" */
export type leave = {
  __typename?: 'leave';
  /** Last day of the leave period */
  endDate: Scalars['date']['output'];
  /** Unique identifier for the leave record */
  id: Scalars['uuid']['output'];
  /** An object relationship */
  leaveRequester: users;
  /** Type of leave (vacation, sick, personal, etc.) */
  leaveType: Scalars['String']['output'];
  /** An object relationship */
  leaveUser: users;
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
export type leaveAggregate = {
  __typename?: 'leaveAggregate';
  aggregate?: Maybe<leaveAggregateFields>;
  nodes: Array<leave>;
};

export type leaveAggregateBoolExp = {
  count?: InputMaybe<leaveAggregateBoolExpCount>;
};

export type leaveAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<leaveSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<leaveBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "leave" */
export type leaveAggregateFields = {
  __typename?: 'leaveAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<leaveMaxFields>;
  min?: Maybe<leaveMinFields>;
};


/** aggregate fields of "leave" */
export type leaveAggregateFieldscountArgs = {
  columns?: InputMaybe<Array<leaveSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "leave" */
export type leaveAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<leaveMaxOrderBy>;
  min?: InputMaybe<leaveMinOrderBy>;
};

/** input type for inserting array relation for remote table "leave" */
export type leaveArrRelInsertInput = {
  data: Array<leaveInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<leaveOnConflict>;
};

/** Boolean expression to filter rows from the table "leave". All fields are combined with a logical 'AND'. */
export type leaveBoolExp = {
  _and?: InputMaybe<Array<leaveBoolExp>>;
  _not?: InputMaybe<leaveBoolExp>;
  _or?: InputMaybe<Array<leaveBoolExp>>;
  endDate?: InputMaybe<DateComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  leaveRequester?: InputMaybe<usersBoolExp>;
  leaveType?: InputMaybe<StringComparisonExp>;
  leaveUser?: InputMaybe<usersBoolExp>;
  reason?: InputMaybe<StringComparisonExp>;
  startDate?: InputMaybe<DateComparisonExp>;
  status?: InputMaybe<LeaveStatusEnumComparisonExp>;
  userId?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "leave" */
export type leaveConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'leave_pkey';

/** input type for inserting data into table "leave" */
export type leaveInsertInput = {
  /** Last day of the leave period */
  endDate?: InputMaybe<Scalars['date']['input']>;
  /** Unique identifier for the leave record */
  id?: InputMaybe<Scalars['uuid']['input']>;
  leaveRequester?: InputMaybe<usersObjRelInsertInput>;
  /** Type of leave (vacation, sick, personal, etc.) */
  leaveType?: InputMaybe<Scalars['String']['input']>;
  leaveUser?: InputMaybe<usersObjRelInsertInput>;
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
export type leaveMaxFields = {
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
export type leaveMaxOrderBy = {
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
export type leaveMinFields = {
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
export type leaveMinOrderBy = {
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
export type leaveMutationResponse = {
  __typename?: 'leaveMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<leave>;
};

/** on_conflict condition type for table "leave" */
export type leaveOnConflict = {
  constraint: leaveConstraint;
  updateColumns?: Array<leaveUpdateColumn>;
  where?: InputMaybe<leaveBoolExp>;
};

/** Ordering options when selecting data from "leave". */
export type leaveOrderBy = {
  endDate?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  leaveRequester?: InputMaybe<usersOrderBy>;
  leaveType?: InputMaybe<OrderBy>;
  leaveUser?: InputMaybe<usersOrderBy>;
  reason?: InputMaybe<OrderBy>;
  startDate?: InputMaybe<OrderBy>;
  status?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: leave */
export type leavePkColumnsInput = {
  /** Unique identifier for the leave record */
  id: Scalars['uuid']['input'];
};

/** select columns of table "leave" */
export type leaveSelectColumn =
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
  | 'userId';

/** input type for updating data in table "leave" */
export type leaveSetInput = {
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
export type leaveStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: leaveStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type leaveStreamCursorValueInput = {
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
export type leaveUpdateColumn =
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
  | 'userId';

export type leaveUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<leaveSetInput>;
  /** filter the rows which have to be updated */
  where: leaveBoolExp;
};

/** mutation root */
export type mutation_root = {
  __typename?: 'mutation_root';
  /** delete data from the table: "adjustment_rules" */
  bulkDeleteAdjustmentRules?: Maybe<adjustmentRulesMutationResponse>;
  /** delete data from the table: "app_settings" */
  bulkDeleteAppSettings?: Maybe<appSettingsMutationResponse>;
  /** delete data from the table: "audit.audit_log" */
  bulkDeleteAuditLogs?: Maybe<auditLogsMutationResponse>;
  /** delete data from the table: "audit.auth_events" */
  bulkDeleteAuthEvents?: Maybe<authEventsMutationResponse>;
  /** delete data from the table: "billing_event_log" */
  bulkDeleteBillingEventLogs?: Maybe<billingEventLogsMutationResponse>;
  /** delete data from the table: "billing_invoice" */
  bulkDeleteBillingInvoice?: Maybe<billingInvoiceMutationResponse>;
  /** delete data from the table: "billing_items" */
  bulkDeleteBillingItems?: Maybe<billingItemsMutationResponse>;
  /** delete data from the table: "billing_plan" */
  bulkDeleteBillingPlans?: Maybe<billingPlansMutationResponse>;
  /** delete data from the table: "client_billing_assignment" */
  bulkDeleteClientBillingAssignments?: Maybe<clientBillingAssignmentsMutationResponse>;
  /** delete data from the table: "client_external_systems" */
  bulkDeleteClientExternalSystems?: Maybe<clientExternalSystemsMutationResponse>;
  /** delete data from the table: "clients" */
  bulkDeleteClients?: Maybe<clientsMutationResponse>;
  /** delete data from the table: "audit.data_access_log" */
  bulkDeleteDataAccessLogs?: Maybe<dataAccessLogsMutationResponse>;
  /** delete data from the table: "external_systems" */
  bulkDeleteExternalSystems?: Maybe<externalSystemsMutationResponse>;
  /** delete data from the table: "feature_flags" */
  bulkDeleteFeatureFlags?: Maybe<featureFlagsMutationResponse>;
  /** delete data from the table: "holidays" */
  bulkDeleteHolidays?: Maybe<holidaysMutationResponse>;
  /** delete data from the table: "latest_payroll_version_results" */
  bulkDeleteLatestPayrollVersionResults?: Maybe<latestPayrollVersionResultsMutationResponse>;
  /** delete data from the table: "leave" */
  bulkDeleteLeave?: Maybe<leaveMutationResponse>;
  /** delete data from the table: "notes" */
  bulkDeleteNotes?: Maybe<notesMutationResponse>;
  /** delete data from the table: "payroll_activation_results" */
  bulkDeletePayrollActivationResults?: Maybe<payrollActivationResultsMutationResponse>;
  /** delete data from the table: "payroll_assignment_audit" */
  bulkDeletePayrollAssignmentAudits?: Maybe<payrollAssignmentAuditsMutationResponse>;
  /** delete data from the table: "payroll_assignments" */
  bulkDeletePayrollAssignments?: Maybe<payrollAssignmentsMutationResponse>;
  /** delete data from the table: "payroll_cycles" */
  bulkDeletePayrollCycles?: Maybe<payrollCyclesMutationResponse>;
  /** delete data from the table: "payroll_date_types" */
  bulkDeletePayrollDateTypes?: Maybe<payrollDateTypesMutationResponse>;
  /** delete data from the table: "payroll_dates" */
  bulkDeletePayrollDates?: Maybe<payrollDatesMutationResponse>;
  /** delete data from the table: "payroll_version_history_results" */
  bulkDeletePayrollVersionHistoryResults?: Maybe<payrollVersionHistoryResultsMutationResponse>;
  /** delete data from the table: "payroll_version_results" */
  bulkDeletePayrollVersionResults?: Maybe<payrollVersionResultsMutationResponse>;
  /** delete data from the table: "payrolls" */
  bulkDeletePayrolls?: Maybe<payrollsMutationResponse>;
  /** delete data from the table: "permission_audit_log" */
  bulkDeletePermissionAuditLogs?: Maybe<permissionAuditLogsMutationResponse>;
  /** delete data from the table: "audit.permission_changes" */
  bulkDeletePermissionChanges?: Maybe<permissionChangesMutationResponse>;
  /** delete data from the table: "permission_overrides" */
  bulkDeletePermissionOverrides?: Maybe<permissionOverridesMutationResponse>;
  /** delete data from the table: "permissions" */
  bulkDeletePermissions?: Maybe<permissionsMutationResponse>;
  /** delete data from the table: "resources" */
  bulkDeleteResources?: Maybe<resourcesMutationResponse>;
  /** delete data from the table: "role_permissions" */
  bulkDeleteRolePermissions?: Maybe<rolePermissionsMutationResponse>;
  /** delete data from the table: "roles" */
  bulkDeleteRoles?: Maybe<rolesMutationResponse>;
  /** delete data from the table: "audit.slow_queries" */
  bulkDeleteSlowQueries?: Maybe<slowQueriesMutationResponse>;
  /** delete data from the table: "audit.user_access_summary" */
  bulkDeleteUserAccessSummaries?: Maybe<userAccessSummariesMutationResponse>;
  /** delete data from the table: "user_invitations" */
  bulkDeleteUserInvitations?: Maybe<userInvitationsMutationResponse>;
  /** delete data from the table: "user_roles" */
  bulkDeleteUserRoles?: Maybe<userRolesMutationResponse>;
  /** delete data from the table: "users" */
  bulkDeleteUsers?: Maybe<usersMutationResponse>;
  /** delete data from the table: "users_role_backup" */
  bulkDeleteUsersRoleBackups?: Maybe<usersRoleBackupMutationResponse>;
  /** delete data from the table: "neon_auth.users_sync" */
  bulkDeleteUsersSync?: Maybe<authUsersSyncMutationResponse>;
  /** delete data from the table: "work_schedule" */
  bulkDeleteWorkSchedules?: Maybe<workSchedulesMutationResponse>;
  /** insert data into the table: "adjustment_rules" */
  bulkInsertAdjustmentRules?: Maybe<adjustmentRulesMutationResponse>;
  /** insert data into the table: "app_settings" */
  bulkInsertAppSettings?: Maybe<appSettingsMutationResponse>;
  /** insert data into the table: "audit.audit_log" */
  bulkInsertAuditLogs?: Maybe<auditLogsMutationResponse>;
  /** insert data into the table: "audit.auth_events" */
  bulkInsertAuthEvents?: Maybe<authEventsMutationResponse>;
  /** insert data into the table: "billing_event_log" */
  bulkInsertBillingEventLogs?: Maybe<billingEventLogsMutationResponse>;
  /** insert data into the table: "billing_invoice" */
  bulkInsertBillingInvoice?: Maybe<billingInvoiceMutationResponse>;
  /** insert data into the table: "billing_items" */
  bulkInsertBillingItems?: Maybe<billingItemsMutationResponse>;
  /** insert data into the table: "billing_plan" */
  bulkInsertBillingPlans?: Maybe<billingPlansMutationResponse>;
  /** insert data into the table: "client_billing_assignment" */
  bulkInsertClientBillingAssignments?: Maybe<clientBillingAssignmentsMutationResponse>;
  /** insert data into the table: "client_external_systems" */
  bulkInsertClientExternalSystems?: Maybe<clientExternalSystemsMutationResponse>;
  /** insert data into the table: "clients" */
  bulkInsertClients?: Maybe<clientsMutationResponse>;
  /** insert data into the table: "audit.data_access_log" */
  bulkInsertDataAccessLogs?: Maybe<dataAccessLogsMutationResponse>;
  /** insert data into the table: "external_systems" */
  bulkInsertExternalSystems?: Maybe<externalSystemsMutationResponse>;
  /** insert data into the table: "feature_flags" */
  bulkInsertFeatureFlags?: Maybe<featureFlagsMutationResponse>;
  /** insert data into the table: "holidays" */
  bulkInsertHolidays?: Maybe<holidaysMutationResponse>;
  /** insert data into the table: "latest_payroll_version_results" */
  bulkInsertLatestPayrollVersionResults?: Maybe<latestPayrollVersionResultsMutationResponse>;
  /** insert data into the table: "leave" */
  bulkInsertLeave?: Maybe<leaveMutationResponse>;
  /** insert data into the table: "notes" */
  bulkInsertNotes?: Maybe<notesMutationResponse>;
  /** insert data into the table: "payroll_activation_results" */
  bulkInsertPayrollActivationResults?: Maybe<payrollActivationResultsMutationResponse>;
  /** insert data into the table: "payroll_assignment_audit" */
  bulkInsertPayrollAssignmentAudits?: Maybe<payrollAssignmentAuditsMutationResponse>;
  /** insert data into the table: "payroll_assignments" */
  bulkInsertPayrollAssignments?: Maybe<payrollAssignmentsMutationResponse>;
  /** insert data into the table: "payroll_cycles" */
  bulkInsertPayrollCycles?: Maybe<payrollCyclesMutationResponse>;
  /** insert data into the table: "payroll_date_types" */
  bulkInsertPayrollDateTypes?: Maybe<payrollDateTypesMutationResponse>;
  /** insert data into the table: "payroll_dates" */
  bulkInsertPayrollDates?: Maybe<payrollDatesMutationResponse>;
  /** insert data into the table: "payroll_version_history_results" */
  bulkInsertPayrollVersionHistoryResults?: Maybe<payrollVersionHistoryResultsMutationResponse>;
  /** insert data into the table: "payroll_version_results" */
  bulkInsertPayrollVersionResults?: Maybe<payrollVersionResultsMutationResponse>;
  /** insert data into the table: "payrolls" */
  bulkInsertPayrolls?: Maybe<payrollsMutationResponse>;
  /** insert data into the table: "permission_audit_log" */
  bulkInsertPermissionAuditLogs?: Maybe<permissionAuditLogsMutationResponse>;
  /** insert data into the table: "audit.permission_changes" */
  bulkInsertPermissionChanges?: Maybe<permissionChangesMutationResponse>;
  /** insert data into the table: "permission_overrides" */
  bulkInsertPermissionOverrides?: Maybe<permissionOverridesMutationResponse>;
  /** insert data into the table: "permissions" */
  bulkInsertPermissions?: Maybe<permissionsMutationResponse>;
  /** insert data into the table: "resources" */
  bulkInsertResources?: Maybe<resourcesMutationResponse>;
  /** insert data into the table: "role_permissions" */
  bulkInsertRolePermissions?: Maybe<rolePermissionsMutationResponse>;
  /** insert data into the table: "roles" */
  bulkInsertRoles?: Maybe<rolesMutationResponse>;
  /** insert data into the table: "audit.slow_queries" */
  bulkInsertSlowQueries?: Maybe<slowQueriesMutationResponse>;
  /** insert data into the table: "audit.user_access_summary" */
  bulkInsertUserAccessSummaries?: Maybe<userAccessSummariesMutationResponse>;
  /** insert data into the table: "user_invitations" */
  bulkInsertUserInvitations?: Maybe<userInvitationsMutationResponse>;
  /** insert data into the table: "user_roles" */
  bulkInsertUserRoles?: Maybe<userRolesMutationResponse>;
  /** insert data into the table: "users" */
  bulkInsertUsers?: Maybe<usersMutationResponse>;
  /** insert data into the table: "users_role_backup" */
  bulkInsertUsersRoleBackups?: Maybe<usersRoleBackupMutationResponse>;
  /** insert data into the table: "neon_auth.users_sync" */
  bulkInsertUsersSync?: Maybe<authUsersSyncMutationResponse>;
  /** insert data into the table: "work_schedule" */
  bulkInsertWorkSchedules?: Maybe<workSchedulesMutationResponse>;
  /** update data of the table: "adjustment_rules" */
  bulkUpdateAdjustmentRules?: Maybe<adjustmentRulesMutationResponse>;
  /** update data of the table: "app_settings" */
  bulkUpdateAppSettings?: Maybe<appSettingsMutationResponse>;
  /** update data of the table: "audit.audit_log" */
  bulkUpdateAuditLogs?: Maybe<auditLogsMutationResponse>;
  /** update data of the table: "audit.auth_events" */
  bulkUpdateAuthEvents?: Maybe<authEventsMutationResponse>;
  /** update data of the table: "billing_event_log" */
  bulkUpdateBillingEventLogs?: Maybe<billingEventLogsMutationResponse>;
  /** update data of the table: "billing_invoice" */
  bulkUpdateBillingInvoice?: Maybe<billingInvoiceMutationResponse>;
  /** update data of the table: "billing_items" */
  bulkUpdateBillingItems?: Maybe<billingItemsMutationResponse>;
  /** update data of the table: "billing_plan" */
  bulkUpdateBillingPlans?: Maybe<billingPlansMutationResponse>;
  /** update data of the table: "client_billing_assignment" */
  bulkUpdateClientBillingAssignments?: Maybe<clientBillingAssignmentsMutationResponse>;
  /** update data of the table: "client_external_systems" */
  bulkUpdateClientExternalSystems?: Maybe<clientExternalSystemsMutationResponse>;
  /** update data of the table: "clients" */
  bulkUpdateClients?: Maybe<clientsMutationResponse>;
  /** update data of the table: "audit.data_access_log" */
  bulkUpdateDataAccessLogs?: Maybe<dataAccessLogsMutationResponse>;
  /** update data of the table: "external_systems" */
  bulkUpdateExternalSystems?: Maybe<externalSystemsMutationResponse>;
  /** update data of the table: "feature_flags" */
  bulkUpdateFeatureFlags?: Maybe<featureFlagsMutationResponse>;
  /** update data of the table: "holidays" */
  bulkUpdateHolidays?: Maybe<holidaysMutationResponse>;
  /** update data of the table: "latest_payroll_version_results" */
  bulkUpdateLatestPayrollVersionResults?: Maybe<latestPayrollVersionResultsMutationResponse>;
  /** update data of the table: "leave" */
  bulkUpdateLeave?: Maybe<leaveMutationResponse>;
  /** update data of the table: "notes" */
  bulkUpdateNotes?: Maybe<notesMutationResponse>;
  /** update data of the table: "payroll_activation_results" */
  bulkUpdatePayrollActivationResults?: Maybe<payrollActivationResultsMutationResponse>;
  /** update data of the table: "payroll_assignment_audit" */
  bulkUpdatePayrollAssignmentAudits?: Maybe<payrollAssignmentAuditsMutationResponse>;
  /** update data of the table: "payroll_assignments" */
  bulkUpdatePayrollAssignments?: Maybe<payrollAssignmentsMutationResponse>;
  /** update data of the table: "payroll_cycles" */
  bulkUpdatePayrollCycles?: Maybe<payrollCyclesMutationResponse>;
  /** update data of the table: "payroll_date_types" */
  bulkUpdatePayrollDateTypes?: Maybe<payrollDateTypesMutationResponse>;
  /** update data of the table: "payroll_dates" */
  bulkUpdatePayrollDates?: Maybe<payrollDatesMutationResponse>;
  /** update data of the table: "payroll_version_history_results" */
  bulkUpdatePayrollVersionHistoryResults?: Maybe<payrollVersionHistoryResultsMutationResponse>;
  /** update data of the table: "payroll_version_results" */
  bulkUpdatePayrollVersionResults?: Maybe<payrollVersionResultsMutationResponse>;
  /** update data of the table: "payrolls" */
  bulkUpdatePayrolls?: Maybe<payrollsMutationResponse>;
  /** update data of the table: "permission_audit_log" */
  bulkUpdatePermissionAuditLogs?: Maybe<permissionAuditLogsMutationResponse>;
  /** update data of the table: "audit.permission_changes" */
  bulkUpdatePermissionChanges?: Maybe<permissionChangesMutationResponse>;
  /** update data of the table: "permission_overrides" */
  bulkUpdatePermissionOverrides?: Maybe<permissionOverridesMutationResponse>;
  /** update data of the table: "permissions" */
  bulkUpdatePermissions?: Maybe<permissionsMutationResponse>;
  /** update data of the table: "resources" */
  bulkUpdateResources?: Maybe<resourcesMutationResponse>;
  /** update data of the table: "role_permissions" */
  bulkUpdateRolePermissions?: Maybe<rolePermissionsMutationResponse>;
  /** update data of the table: "roles" */
  bulkUpdateRoles?: Maybe<rolesMutationResponse>;
  /** update data of the table: "audit.slow_queries" */
  bulkUpdateSlowQueries?: Maybe<slowQueriesMutationResponse>;
  /** update data of the table: "audit.user_access_summary" */
  bulkUpdateUserAccessSummaries?: Maybe<userAccessSummariesMutationResponse>;
  /** update data of the table: "user_invitations" */
  bulkUpdateUserInvitations?: Maybe<userInvitationsMutationResponse>;
  /** update data of the table: "user_roles" */
  bulkUpdateUserRoles?: Maybe<userRolesMutationResponse>;
  /** update data of the table: "users" */
  bulkUpdateUsers?: Maybe<usersMutationResponse>;
  /** update data of the table: "users_role_backup" */
  bulkUpdateUsersRoleBackups?: Maybe<usersRoleBackupMutationResponse>;
  /** update data of the table: "neon_auth.users_sync" */
  bulkUpdateUsersSync?: Maybe<authUsersSyncMutationResponse>;
  /** update data of the table: "work_schedule" */
  bulkUpdateWorkSchedules?: Maybe<workSchedulesMutationResponse>;
  /** Check for suspicious activity patterns */
  checkSuspiciousActivity?: Maybe<SuspiciousActivityResponse>;
  commitPayrollAssignments?: Maybe<CommitPayrollAssignmentsOutput>;
  /** delete single row from the table: "adjustment_rules" */
  deleteAdjustmentRuleById?: Maybe<adjustmentRules>;
  /** delete single row from the table: "app_settings" */
  deleteAppSettingById?: Maybe<appSettings>;
  /** delete single row from the table: "audit.audit_log" */
  deleteAuditLogById?: Maybe<auditLogs>;
  /** delete single row from the table: "audit.auth_events" */
  deleteAuthEventById?: Maybe<authEvents>;
  /** delete single row from the table: "billing_event_log" */
  deleteBillingEventLogById?: Maybe<billingEventLogs>;
  /** delete single row from the table: "billing_invoice" */
  deleteBillingInvoiceById?: Maybe<billingInvoice>;
  /** delete data from the table: "billing_invoice_item" */
  deleteBillingInvoiceItem?: Maybe<BillingInvoiceItemMutationResponse>;
  /** delete single row from the table: "billing_invoice_item" */
  deleteBillingInvoiceItemByPk?: Maybe<BillingInvoiceItem>;
  /** delete single row from the table: "billing_items" */
  deleteBillingItemById?: Maybe<billingItems>;
  /** delete single row from the table: "billing_plan" */
  deleteBillingPlanById?: Maybe<billingPlans>;
  /** delete single row from the table: "client_billing_assignment" */
  deleteClientBillingAssignmentById?: Maybe<clientBillingAssignments>;
  /** delete single row from the table: "clients" */
  deleteClientById?: Maybe<clients>;
  /** delete single row from the table: "client_external_systems" */
  deleteClientExternalSystemById?: Maybe<clientExternalSystems>;
  /** delete single row from the table: "audit.data_access_log" */
  deleteDataAccessLogById?: Maybe<dataAccessLogs>;
  /** delete single row from the table: "external_systems" */
  deleteExternalSystemById?: Maybe<externalSystems>;
  /** delete single row from the table: "feature_flags" */
  deleteFeatureFlagById?: Maybe<featureFlags>;
  /** delete single row from the table: "holidays" */
  deleteHolidayById?: Maybe<holidays>;
  /** delete single row from the table: "latest_payroll_version_results" */
  deleteLatestPayrollVersionResultById?: Maybe<latestPayrollVersionResults>;
  /** delete single row from the table: "leave" */
  deleteLeaveById?: Maybe<leave>;
  /** delete single row from the table: "notes" */
  deleteNoteById?: Maybe<notes>;
  /** delete single row from the table: "payroll_activation_results" */
  deletePayrollActivationResultById?: Maybe<payrollActivationResults>;
  /** delete single row from the table: "payroll_assignment_audit" */
  deletePayrollAssignmentAuditById?: Maybe<payrollAssignmentAudits>;
  /** delete single row from the table: "payroll_assignments" */
  deletePayrollAssignmentById?: Maybe<payrollAssignments>;
  /** delete single row from the table: "payrolls" */
  deletePayrollById?: Maybe<payrolls>;
  /** delete single row from the table: "payroll_cycles" */
  deletePayrollCycleById?: Maybe<payrollCycles>;
  /** delete single row from the table: "payroll_dates" */
  deletePayrollDateById?: Maybe<payrollDates>;
  /** delete single row from the table: "payroll_date_types" */
  deletePayrollDateTypeById?: Maybe<payrollDateTypes>;
  /** delete single row from the table: "payroll_version_history_results" */
  deletePayrollVersionHistoryResultById?: Maybe<payrollVersionHistoryResults>;
  /** delete single row from the table: "payroll_version_results" */
  deletePayrollVersionResultById?: Maybe<payrollVersionResults>;
  /** delete single row from the table: "permission_audit_log" */
  deletePermissionAuditLogById?: Maybe<permissionAuditLogs>;
  /** delete single row from the table: "permissions" */
  deletePermissionById?: Maybe<permissions>;
  /** delete single row from the table: "audit.permission_changes" */
  deletePermissionChangeById?: Maybe<permissionChanges>;
  /** delete single row from the table: "permission_overrides" */
  deletePermissionOverrideById?: Maybe<permissionOverrides>;
  /** delete single row from the table: "resources" */
  deleteResourceById?: Maybe<resources>;
  /** delete single row from the table: "roles" */
  deleteRoleById?: Maybe<roles>;
  /** delete single row from the table: "role_permissions" */
  deleteRolePermissionById?: Maybe<rolePermissions>;
  /** delete single row from the table: "audit.slow_queries" */
  deleteSlowQueryById?: Maybe<slowQueries>;
  /** delete single row from the table: "users" */
  deleteUserById?: Maybe<users>;
  /** delete single row from the table: "user_invitations" */
  deleteUserInvitationById?: Maybe<userInvitations>;
  /** delete single row from the table: "user_roles" */
  deleteUserRoleById?: Maybe<userRoles>;
  /** delete single row from the table: "neon_auth.users_sync" */
  deleteUserSyncById?: Maybe<authUsersSync>;
  /** delete single row from the table: "work_schedule" */
  deleteWorkScheduleById?: Maybe<workSchedules>;
  /** Generate SOC2 compliance reports */
  generateComplianceReport?: Maybe<ComplianceReportResponse>;
  /** insert a single row into the table: "adjustment_rules" */
  insertAdjustmentRule?: Maybe<adjustmentRules>;
  /** insert a single row into the table: "app_settings" */
  insertAppSetting?: Maybe<appSettings>;
  /** insert a single row into the table: "audit.audit_log" */
  insertAuditLog?: Maybe<auditLogs>;
  /** insert a single row into the table: "audit.auth_events" */
  insertAuthEvent?: Maybe<authEvents>;
  /** insert a single row into the table: "billing_event_log" */
  insertBillingEventLog?: Maybe<billingEventLogs>;
  /** insert a single row into the table: "billing_invoice" */
  insertBillingInvoice?: Maybe<billingInvoice>;
  /** insert data into the table: "billing_invoice_item" */
  insertBillingInvoiceItem?: Maybe<BillingInvoiceItemMutationResponse>;
  /** insert a single row into the table: "billing_invoice_item" */
  insertBillingInvoiceItemOne?: Maybe<BillingInvoiceItem>;
  /** insert a single row into the table: "billing_items" */
  insertBillingItem?: Maybe<billingItems>;
  /** insert a single row into the table: "billing_plan" */
  insertBillingPlan?: Maybe<billingPlans>;
  /** insert a single row into the table: "clients" */
  insertClient?: Maybe<clients>;
  /** insert a single row into the table: "client_billing_assignment" */
  insertClientBillingAssignment?: Maybe<clientBillingAssignments>;
  /** insert a single row into the table: "client_external_systems" */
  insertClientExternalSystem?: Maybe<clientExternalSystems>;
  /** insert a single row into the table: "audit.data_access_log" */
  insertDataAccessLog?: Maybe<dataAccessLogs>;
  /** insert a single row into the table: "external_systems" */
  insertExternalSystem?: Maybe<externalSystems>;
  /** insert a single row into the table: "feature_flags" */
  insertFeatureFlag?: Maybe<featureFlags>;
  /** insert a single row into the table: "holidays" */
  insertHoliday?: Maybe<holidays>;
  /** insert a single row into the table: "latest_payroll_version_results" */
  insertLatestPayrollVersionResult?: Maybe<latestPayrollVersionResults>;
  /** insert a single row into the table: "leave" */
  insertLeave?: Maybe<leave>;
  /** insert a single row into the table: "notes" */
  insertNote?: Maybe<notes>;
  /** insert a single row into the table: "payrolls" */
  insertPayroll?: Maybe<payrolls>;
  /** insert a single row into the table: "payroll_activation_results" */
  insertPayrollActivationResult?: Maybe<payrollActivationResults>;
  /** insert a single row into the table: "payroll_assignments" */
  insertPayrollAssignment?: Maybe<payrollAssignments>;
  /** insert a single row into the table: "payroll_assignment_audit" */
  insertPayrollAssignmentAudit?: Maybe<payrollAssignmentAudits>;
  /** insert a single row into the table: "payroll_cycles" */
  insertPayrollCycle?: Maybe<payrollCycles>;
  /** insert a single row into the table: "payroll_dates" */
  insertPayrollDate?: Maybe<payrollDates>;
  /** insert a single row into the table: "payroll_date_types" */
  insertPayrollDateType?: Maybe<payrollDateTypes>;
  /** insert a single row into the table: "payroll_version_history_results" */
  insertPayrollVersionHistoryResult?: Maybe<payrollVersionHistoryResults>;
  /** insert a single row into the table: "payroll_version_results" */
  insertPayrollVersionResult?: Maybe<payrollVersionResults>;
  /** insert a single row into the table: "permissions" */
  insertPermission?: Maybe<permissions>;
  /** insert a single row into the table: "permission_audit_log" */
  insertPermissionAuditLog?: Maybe<permissionAuditLogs>;
  /** insert a single row into the table: "audit.permission_changes" */
  insertPermissionChange?: Maybe<permissionChanges>;
  /** insert a single row into the table: "permission_overrides" */
  insertPermissionOverride?: Maybe<permissionOverrides>;
  /** insert a single row into the table: "resources" */
  insertResource?: Maybe<resources>;
  /** insert a single row into the table: "roles" */
  insertRole?: Maybe<roles>;
  /** insert a single row into the table: "role_permissions" */
  insertRolePermission?: Maybe<rolePermissions>;
  /** insert a single row into the table: "audit.slow_queries" */
  insertSlowQuery?: Maybe<slowQueries>;
  /** insert a single row into the table: "users" */
  insertUser?: Maybe<users>;
  /** insert a single row into the table: "audit.user_access_summary" */
  insertUserAccessSummary?: Maybe<userAccessSummaries>;
  /** insert a single row into the table: "user_invitations" */
  insertUserInvitation?: Maybe<userInvitations>;
  /** insert a single row into the table: "user_roles" */
  insertUserRole?: Maybe<userRoles>;
  /** insert a single row into the table: "neon_auth.users_sync" */
  insertUserSync?: Maybe<authUsersSync>;
  /** insert a single row into the table: "users_role_backup" */
  insertUsersRoleBackup?: Maybe<usersRoleBackup>;
  /** insert a single row into the table: "work_schedule" */
  insertWorkSchedule?: Maybe<workSchedules>;
  /** Log audit events for SOC2 compliance */
  logAuditEvent?: Maybe<AuditEventResponse>;
  /** update single row of the table: "adjustment_rules" */
  updateAdjustmentRuleById?: Maybe<adjustmentRules>;
  /** update multiples rows of table: "adjustment_rules" */
  updateAdjustmentRulesMany?: Maybe<Array<Maybe<adjustmentRulesMutationResponse>>>;
  /** update single row of the table: "app_settings" */
  updateAppSettingById?: Maybe<appSettings>;
  /** update multiples rows of table: "app_settings" */
  updateAppSettingsMany?: Maybe<Array<Maybe<appSettingsMutationResponse>>>;
  /** update single row of the table: "audit.audit_log" */
  updateAuditLogById?: Maybe<auditLogs>;
  /** update multiples rows of table: "audit.audit_log" */
  updateAuditLogsMany?: Maybe<Array<Maybe<auditLogsMutationResponse>>>;
  /** update single row of the table: "audit.auth_events" */
  updateAuthEventById?: Maybe<authEvents>;
  /** update multiples rows of table: "audit.auth_events" */
  updateAuthEventsMany?: Maybe<Array<Maybe<authEventsMutationResponse>>>;
  /** update multiples rows of table: "neon_auth.users_sync" */
  updateAuthUsersSyncMany?: Maybe<Array<Maybe<authUsersSyncMutationResponse>>>;
  /** update single row of the table: "billing_event_log" */
  updateBillingEventLogById?: Maybe<billingEventLogs>;
  /** update multiples rows of table: "billing_event_log" */
  updateBillingEventLogsMany?: Maybe<Array<Maybe<billingEventLogsMutationResponse>>>;
  /** update single row of the table: "billing_invoice" */
  updateBillingInvoiceById?: Maybe<billingInvoice>;
  /** update data of the table: "billing_invoice_item" */
  updateBillingInvoiceItem?: Maybe<BillingInvoiceItemMutationResponse>;
  /** update single row of the table: "billing_invoice_item" */
  updateBillingInvoiceItemByPk?: Maybe<BillingInvoiceItem>;
  /** update multiples rows of table: "billing_invoice_item" */
  updateBillingInvoiceItemMany?: Maybe<Array<Maybe<BillingInvoiceItemMutationResponse>>>;
  /** update multiples rows of table: "billing_invoice" */
  updateBillingInvoiceMany?: Maybe<Array<Maybe<billingInvoiceMutationResponse>>>;
  /** update single row of the table: "billing_items" */
  updateBillingItemById?: Maybe<billingItems>;
  /** update multiples rows of table: "billing_items" */
  updateBillingItemsMany?: Maybe<Array<Maybe<billingItemsMutationResponse>>>;
  /** update single row of the table: "billing_plan" */
  updateBillingPlanById?: Maybe<billingPlans>;
  /** update multiples rows of table: "billing_plan" */
  updateBillingPlansMany?: Maybe<Array<Maybe<billingPlansMutationResponse>>>;
  /** update single row of the table: "client_billing_assignment" */
  updateClientBillingAssignmentById?: Maybe<clientBillingAssignments>;
  /** update multiples rows of table: "client_billing_assignment" */
  updateClientBillingAssignmentsMany?: Maybe<Array<Maybe<clientBillingAssignmentsMutationResponse>>>;
  /** update single row of the table: "clients" */
  updateClientById?: Maybe<clients>;
  /** update single row of the table: "client_external_systems" */
  updateClientExternalSystemById?: Maybe<clientExternalSystems>;
  /** update multiples rows of table: "client_external_systems" */
  updateClientExternalSystemsMany?: Maybe<Array<Maybe<clientExternalSystemsMutationResponse>>>;
  /** update multiples rows of table: "clients" */
  updateClientsMany?: Maybe<Array<Maybe<clientsMutationResponse>>>;
  /** update single row of the table: "audit.data_access_log" */
  updateDataAccessLogById?: Maybe<dataAccessLogs>;
  /** update multiples rows of table: "audit.data_access_log" */
  updateDataAccessLogsMany?: Maybe<Array<Maybe<dataAccessLogsMutationResponse>>>;
  /** update single row of the table: "external_systems" */
  updateExternalSystemById?: Maybe<externalSystems>;
  /** update multiples rows of table: "external_systems" */
  updateExternalSystemsMany?: Maybe<Array<Maybe<externalSystemsMutationResponse>>>;
  /** update single row of the table: "feature_flags" */
  updateFeatureFlagById?: Maybe<featureFlags>;
  /** update multiples rows of table: "feature_flags" */
  updateFeatureFlagsMany?: Maybe<Array<Maybe<featureFlagsMutationResponse>>>;
  /** update single row of the table: "holidays" */
  updateHolidayById?: Maybe<holidays>;
  /** update multiples rows of table: "holidays" */
  updateHolidaysMany?: Maybe<Array<Maybe<holidaysMutationResponse>>>;
  /** update single row of the table: "latest_payroll_version_results" */
  updateLatestPayrollVersionResultById?: Maybe<latestPayrollVersionResults>;
  /** update multiples rows of table: "latest_payroll_version_results" */
  updateLatestPayrollVersionResultsMany?: Maybe<Array<Maybe<latestPayrollVersionResultsMutationResponse>>>;
  /** update single row of the table: "leave" */
  updateLeaveById?: Maybe<leave>;
  /** update multiples rows of table: "leave" */
  updateLeaveMany?: Maybe<Array<Maybe<leaveMutationResponse>>>;
  /** update single row of the table: "notes" */
  updateNoteById?: Maybe<notes>;
  /** update multiples rows of table: "notes" */
  updateNotesMany?: Maybe<Array<Maybe<notesMutationResponse>>>;
  /** update single row of the table: "payroll_activation_results" */
  updatePayrollActivationResultById?: Maybe<payrollActivationResults>;
  /** update multiples rows of table: "payroll_activation_results" */
  updatePayrollActivationResultsMany?: Maybe<Array<Maybe<payrollActivationResultsMutationResponse>>>;
  /** update single row of the table: "payroll_assignment_audit" */
  updatePayrollAssignmentAuditById?: Maybe<payrollAssignmentAudits>;
  /** update multiples rows of table: "payroll_assignment_audit" */
  updatePayrollAssignmentAuditsMany?: Maybe<Array<Maybe<payrollAssignmentAuditsMutationResponse>>>;
  /** update single row of the table: "payroll_assignments" */
  updatePayrollAssignmentById?: Maybe<payrollAssignments>;
  /** update multiples rows of table: "payroll_assignments" */
  updatePayrollAssignmentsMany?: Maybe<Array<Maybe<payrollAssignmentsMutationResponse>>>;
  /** update single row of the table: "payrolls" */
  updatePayrollById?: Maybe<payrolls>;
  /** update single row of the table: "payroll_cycles" */
  updatePayrollCycleById?: Maybe<payrollCycles>;
  /** update multiples rows of table: "payroll_cycles" */
  updatePayrollCyclesMany?: Maybe<Array<Maybe<payrollCyclesMutationResponse>>>;
  /** update single row of the table: "payroll_dates" */
  updatePayrollDateById?: Maybe<payrollDates>;
  /** update single row of the table: "payroll_date_types" */
  updatePayrollDateTypeById?: Maybe<payrollDateTypes>;
  /** update multiples rows of table: "payroll_date_types" */
  updatePayrollDateTypesMany?: Maybe<Array<Maybe<payrollDateTypesMutationResponse>>>;
  /** update multiples rows of table: "payroll_dates" */
  updatePayrollDatesMany?: Maybe<Array<Maybe<payrollDatesMutationResponse>>>;
  /** update single row of the table: "payroll_version_history_results" */
  updatePayrollVersionHistoryResultById?: Maybe<payrollVersionHistoryResults>;
  /** update multiples rows of table: "payroll_version_history_results" */
  updatePayrollVersionHistoryResultsMany?: Maybe<Array<Maybe<payrollVersionHistoryResultsMutationResponse>>>;
  /** update single row of the table: "payroll_version_results" */
  updatePayrollVersionResultById?: Maybe<payrollVersionResults>;
  /** update multiples rows of table: "payroll_version_results" */
  updatePayrollVersionResultsMany?: Maybe<Array<Maybe<payrollVersionResultsMutationResponse>>>;
  /** update multiples rows of table: "payrolls" */
  updatePayrollsMany?: Maybe<Array<Maybe<payrollsMutationResponse>>>;
  /** update single row of the table: "permission_audit_log" */
  updatePermissionAuditLogById?: Maybe<permissionAuditLogs>;
  /** update multiples rows of table: "permission_audit_log" */
  updatePermissionAuditLogsMany?: Maybe<Array<Maybe<permissionAuditLogsMutationResponse>>>;
  /** update single row of the table: "permissions" */
  updatePermissionById?: Maybe<permissions>;
  /** update single row of the table: "audit.permission_changes" */
  updatePermissionChangeById?: Maybe<permissionChanges>;
  /** update multiples rows of table: "audit.permission_changes" */
  updatePermissionChangesMany?: Maybe<Array<Maybe<permissionChangesMutationResponse>>>;
  /** update single row of the table: "permission_overrides" */
  updatePermissionOverrideById?: Maybe<permissionOverrides>;
  /** update multiples rows of table: "permission_overrides" */
  updatePermissionOverridesMany?: Maybe<Array<Maybe<permissionOverridesMutationResponse>>>;
  /** update multiples rows of table: "permissions" */
  updatePermissionsMany?: Maybe<Array<Maybe<permissionsMutationResponse>>>;
  /** update single row of the table: "resources" */
  updateResourceById?: Maybe<resources>;
  /** update multiples rows of table: "resources" */
  updateResourcesMany?: Maybe<Array<Maybe<resourcesMutationResponse>>>;
  /** update single row of the table: "roles" */
  updateRoleById?: Maybe<roles>;
  /** update single row of the table: "role_permissions" */
  updateRolePermissionById?: Maybe<rolePermissions>;
  /** update multiples rows of table: "role_permissions" */
  updateRolePermissionsMany?: Maybe<Array<Maybe<rolePermissionsMutationResponse>>>;
  /** update multiples rows of table: "roles" */
  updateRolesMany?: Maybe<Array<Maybe<rolesMutationResponse>>>;
  /** update multiples rows of table: "audit.slow_queries" */
  updateSlowQueriesMany?: Maybe<Array<Maybe<slowQueriesMutationResponse>>>;
  /** update single row of the table: "audit.slow_queries" */
  updateSlowQueryById?: Maybe<slowQueries>;
  /** update multiples rows of table: "audit.user_access_summary" */
  updateUserAccessSummariesMany?: Maybe<Array<Maybe<userAccessSummariesMutationResponse>>>;
  /** update single row of the table: "users" */
  updateUserById?: Maybe<users>;
  /** update single row of the table: "user_invitations" */
  updateUserInvitationById?: Maybe<userInvitations>;
  /** update multiples rows of table: "user_invitations" */
  updateUserInvitationsMany?: Maybe<Array<Maybe<userInvitationsMutationResponse>>>;
  /** update single row of the table: "user_roles" */
  updateUserRoleById?: Maybe<userRoles>;
  /** update multiples rows of table: "user_roles" */
  updateUserRolesMany?: Maybe<Array<Maybe<userRolesMutationResponse>>>;
  /** update single row of the table: "neon_auth.users_sync" */
  updateUserSyncById?: Maybe<authUsersSync>;
  /** update multiples rows of table: "users" */
  updateUsersMany?: Maybe<Array<Maybe<usersMutationResponse>>>;
  /** update multiples rows of table: "users_role_backup" */
  updateUsersRoleBackupMany?: Maybe<Array<Maybe<usersRoleBackupMutationResponse>>>;
  /** update single row of the table: "work_schedule" */
  updateWorkScheduleById?: Maybe<workSchedules>;
  /** update multiples rows of table: "work_schedule" */
  updateWorkSchedulesMany?: Maybe<Array<Maybe<workSchedulesMutationResponse>>>;
};


/** mutation root */
export type mutation_rootbulkDeleteAdjustmentRulesArgs = {
  where: adjustmentRulesBoolExp;
};


/** mutation root */
export type mutation_rootbulkDeleteAppSettingsArgs = {
  where: appSettingsBoolExp;
};


/** mutation root */
export type mutation_rootbulkDeleteAuditLogsArgs = {
  where: auditLogsBoolExp;
};


/** mutation root */
export type mutation_rootbulkDeleteAuthEventsArgs = {
  where: authEventsBoolExp;
};


/** mutation root */
export type mutation_rootbulkDeleteBillingEventLogsArgs = {
  where: billingEventLogsBoolExp;
};


/** mutation root */
export type mutation_rootbulkDeleteBillingInvoiceArgs = {
  where: billingInvoiceBoolExp;
};


/** mutation root */
export type mutation_rootbulkDeleteBillingItemsArgs = {
  where: billingItemsBoolExp;
};


/** mutation root */
export type mutation_rootbulkDeleteBillingPlansArgs = {
  where: billingPlansBoolExp;
};


/** mutation root */
export type mutation_rootbulkDeleteClientBillingAssignmentsArgs = {
  where: clientBillingAssignmentsBoolExp;
};


/** mutation root */
export type mutation_rootbulkDeleteClientExternalSystemsArgs = {
  where: clientExternalSystemsBoolExp;
};


/** mutation root */
export type mutation_rootbulkDeleteClientsArgs = {
  where: clientsBoolExp;
};


/** mutation root */
export type mutation_rootbulkDeleteDataAccessLogsArgs = {
  where: dataAccessLogsBoolExp;
};


/** mutation root */
export type mutation_rootbulkDeleteExternalSystemsArgs = {
  where: externalSystemsBoolExp;
};


/** mutation root */
export type mutation_rootbulkDeleteFeatureFlagsArgs = {
  where: featureFlagsBoolExp;
};


/** mutation root */
export type mutation_rootbulkDeleteHolidaysArgs = {
  where: holidaysBoolExp;
};


/** mutation root */
export type mutation_rootbulkDeleteLatestPayrollVersionResultsArgs = {
  where: latestPayrollVersionResultsBoolExp;
};


/** mutation root */
export type mutation_rootbulkDeleteLeaveArgs = {
  where: leaveBoolExp;
};


/** mutation root */
export type mutation_rootbulkDeleteNotesArgs = {
  where: notesBoolExp;
};


/** mutation root */
export type mutation_rootbulkDeletePayrollActivationResultsArgs = {
  where: payrollActivationResultsBoolExp;
};


/** mutation root */
export type mutation_rootbulkDeletePayrollAssignmentAuditsArgs = {
  where: payrollAssignmentAuditsBoolExp;
};


/** mutation root */
export type mutation_rootbulkDeletePayrollAssignmentsArgs = {
  where: payrollAssignmentsBoolExp;
};


/** mutation root */
export type mutation_rootbulkDeletePayrollCyclesArgs = {
  where: payrollCyclesBoolExp;
};


/** mutation root */
export type mutation_rootbulkDeletePayrollDateTypesArgs = {
  where: payrollDateTypesBoolExp;
};


/** mutation root */
export type mutation_rootbulkDeletePayrollDatesArgs = {
  where: payrollDatesBoolExp;
};


/** mutation root */
export type mutation_rootbulkDeletePayrollVersionHistoryResultsArgs = {
  where: payrollVersionHistoryResultsBoolExp;
};


/** mutation root */
export type mutation_rootbulkDeletePayrollVersionResultsArgs = {
  where: payrollVersionResultsBoolExp;
};


/** mutation root */
export type mutation_rootbulkDeletePayrollsArgs = {
  where: payrollsBoolExp;
};


/** mutation root */
export type mutation_rootbulkDeletePermissionAuditLogsArgs = {
  where: permissionAuditLogsBoolExp;
};


/** mutation root */
export type mutation_rootbulkDeletePermissionChangesArgs = {
  where: permissionChangesBoolExp;
};


/** mutation root */
export type mutation_rootbulkDeletePermissionOverridesArgs = {
  where: permissionOverridesBoolExp;
};


/** mutation root */
export type mutation_rootbulkDeletePermissionsArgs = {
  where: permissionsBoolExp;
};


/** mutation root */
export type mutation_rootbulkDeleteResourcesArgs = {
  where: resourcesBoolExp;
};


/** mutation root */
export type mutation_rootbulkDeleteRolePermissionsArgs = {
  where: rolePermissionsBoolExp;
};


/** mutation root */
export type mutation_rootbulkDeleteRolesArgs = {
  where: rolesBoolExp;
};


/** mutation root */
export type mutation_rootbulkDeleteSlowQueriesArgs = {
  where: slowQueriesBoolExp;
};


/** mutation root */
export type mutation_rootbulkDeleteUserAccessSummariesArgs = {
  where: userAccessSummariesBoolExp;
};


/** mutation root */
export type mutation_rootbulkDeleteUserInvitationsArgs = {
  where: userInvitationsBoolExp;
};


/** mutation root */
export type mutation_rootbulkDeleteUserRolesArgs = {
  where: userRolesBoolExp;
};


/** mutation root */
export type mutation_rootbulkDeleteUsersArgs = {
  where: usersBoolExp;
};


/** mutation root */
export type mutation_rootbulkDeleteUsersRoleBackupsArgs = {
  where: usersRoleBackupBoolExp;
};


/** mutation root */
export type mutation_rootbulkDeleteUsersSyncArgs = {
  where: authUsersSyncBoolExp;
};


/** mutation root */
export type mutation_rootbulkDeleteWorkSchedulesArgs = {
  where: workSchedulesBoolExp;
};


/** mutation root */
export type mutation_rootbulkInsertAdjustmentRulesArgs = {
  objects: Array<adjustmentRulesInsertInput>;
  onConflict?: InputMaybe<adjustmentRulesOnConflict>;
};


/** mutation root */
export type mutation_rootbulkInsertAppSettingsArgs = {
  objects: Array<appSettingsInsertInput>;
  onConflict?: InputMaybe<appSettingsOnConflict>;
};


/** mutation root */
export type mutation_rootbulkInsertAuditLogsArgs = {
  objects: Array<auditLogsInsertInput>;
  onConflict?: InputMaybe<auditLogsOnConflict>;
};


/** mutation root */
export type mutation_rootbulkInsertAuthEventsArgs = {
  objects: Array<authEventsInsertInput>;
  onConflict?: InputMaybe<authEventsOnConflict>;
};


/** mutation root */
export type mutation_rootbulkInsertBillingEventLogsArgs = {
  objects: Array<billingEventLogsInsertInput>;
  onConflict?: InputMaybe<billingEventLogsOnConflict>;
};


/** mutation root */
export type mutation_rootbulkInsertBillingInvoiceArgs = {
  objects: Array<billingInvoiceInsertInput>;
  onConflict?: InputMaybe<billingInvoiceOnConflict>;
};


/** mutation root */
export type mutation_rootbulkInsertBillingItemsArgs = {
  objects: Array<billingItemsInsertInput>;
  onConflict?: InputMaybe<billingItemsOnConflict>;
};


/** mutation root */
export type mutation_rootbulkInsertBillingPlansArgs = {
  objects: Array<billingPlansInsertInput>;
  onConflict?: InputMaybe<billingPlansOnConflict>;
};


/** mutation root */
export type mutation_rootbulkInsertClientBillingAssignmentsArgs = {
  objects: Array<clientBillingAssignmentsInsertInput>;
  onConflict?: InputMaybe<clientBillingAssignmentsOnConflict>;
};


/** mutation root */
export type mutation_rootbulkInsertClientExternalSystemsArgs = {
  objects: Array<clientExternalSystemsInsertInput>;
  onConflict?: InputMaybe<clientExternalSystemsOnConflict>;
};


/** mutation root */
export type mutation_rootbulkInsertClientsArgs = {
  objects: Array<clientsInsertInput>;
  onConflict?: InputMaybe<clientsOnConflict>;
};


/** mutation root */
export type mutation_rootbulkInsertDataAccessLogsArgs = {
  objects: Array<dataAccessLogsInsertInput>;
  onConflict?: InputMaybe<dataAccessLogsOnConflict>;
};


/** mutation root */
export type mutation_rootbulkInsertExternalSystemsArgs = {
  objects: Array<externalSystemsInsertInput>;
  onConflict?: InputMaybe<externalSystemsOnConflict>;
};


/** mutation root */
export type mutation_rootbulkInsertFeatureFlagsArgs = {
  objects: Array<featureFlagsInsertInput>;
  onConflict?: InputMaybe<featureFlagsOnConflict>;
};


/** mutation root */
export type mutation_rootbulkInsertHolidaysArgs = {
  objects: Array<holidaysInsertInput>;
  onConflict?: InputMaybe<holidaysOnConflict>;
};


/** mutation root */
export type mutation_rootbulkInsertLatestPayrollVersionResultsArgs = {
  objects: Array<latestPayrollVersionResultsInsertInput>;
  onConflict?: InputMaybe<latestPayrollVersionResultsOnConflict>;
};


/** mutation root */
export type mutation_rootbulkInsertLeaveArgs = {
  objects: Array<leaveInsertInput>;
  onConflict?: InputMaybe<leaveOnConflict>;
};


/** mutation root */
export type mutation_rootbulkInsertNotesArgs = {
  objects: Array<notesInsertInput>;
  onConflict?: InputMaybe<notesOnConflict>;
};


/** mutation root */
export type mutation_rootbulkInsertPayrollActivationResultsArgs = {
  objects: Array<payrollActivationResultsInsertInput>;
  onConflict?: InputMaybe<payrollActivationResultsOnConflict>;
};


/** mutation root */
export type mutation_rootbulkInsertPayrollAssignmentAuditsArgs = {
  objects: Array<payrollAssignmentAuditsInsertInput>;
  onConflict?: InputMaybe<payrollAssignmentAuditsOnConflict>;
};


/** mutation root */
export type mutation_rootbulkInsertPayrollAssignmentsArgs = {
  objects: Array<payrollAssignmentsInsertInput>;
  onConflict?: InputMaybe<payrollAssignmentsOnConflict>;
};


/** mutation root */
export type mutation_rootbulkInsertPayrollCyclesArgs = {
  objects: Array<payrollCyclesInsertInput>;
  onConflict?: InputMaybe<payrollCyclesOnConflict>;
};


/** mutation root */
export type mutation_rootbulkInsertPayrollDateTypesArgs = {
  objects: Array<payrollDateTypesInsertInput>;
  onConflict?: InputMaybe<payrollDateTypesOnConflict>;
};


/** mutation root */
export type mutation_rootbulkInsertPayrollDatesArgs = {
  objects: Array<payrollDatesInsertInput>;
  onConflict?: InputMaybe<payrollDatesOnConflict>;
};


/** mutation root */
export type mutation_rootbulkInsertPayrollVersionHistoryResultsArgs = {
  objects: Array<payrollVersionHistoryResultsInsertInput>;
  onConflict?: InputMaybe<payrollVersionHistoryResultsOnConflict>;
};


/** mutation root */
export type mutation_rootbulkInsertPayrollVersionResultsArgs = {
  objects: Array<payrollVersionResultsInsertInput>;
  onConflict?: InputMaybe<payrollVersionResultsOnConflict>;
};


/** mutation root */
export type mutation_rootbulkInsertPayrollsArgs = {
  objects: Array<payrollsInsertInput>;
  onConflict?: InputMaybe<payrollsOnConflict>;
};


/** mutation root */
export type mutation_rootbulkInsertPermissionAuditLogsArgs = {
  objects: Array<permissionAuditLogsInsertInput>;
  onConflict?: InputMaybe<permissionAuditLogsOnConflict>;
};


/** mutation root */
export type mutation_rootbulkInsertPermissionChangesArgs = {
  objects: Array<permissionChangesInsertInput>;
  onConflict?: InputMaybe<permissionChangesOnConflict>;
};


/** mutation root */
export type mutation_rootbulkInsertPermissionOverridesArgs = {
  objects: Array<permissionOverridesInsertInput>;
  onConflict?: InputMaybe<permissionOverridesOnConflict>;
};


/** mutation root */
export type mutation_rootbulkInsertPermissionsArgs = {
  objects: Array<permissionsInsertInput>;
  onConflict?: InputMaybe<permissionsOnConflict>;
};


/** mutation root */
export type mutation_rootbulkInsertResourcesArgs = {
  objects: Array<resourcesInsertInput>;
  onConflict?: InputMaybe<resourcesOnConflict>;
};


/** mutation root */
export type mutation_rootbulkInsertRolePermissionsArgs = {
  objects: Array<rolePermissionsInsertInput>;
  onConflict?: InputMaybe<rolePermissionsOnConflict>;
};


/** mutation root */
export type mutation_rootbulkInsertRolesArgs = {
  objects: Array<rolesInsertInput>;
  onConflict?: InputMaybe<rolesOnConflict>;
};


/** mutation root */
export type mutation_rootbulkInsertSlowQueriesArgs = {
  objects: Array<slowQueriesInsertInput>;
  onConflict?: InputMaybe<slowQueriesOnConflict>;
};


/** mutation root */
export type mutation_rootbulkInsertUserAccessSummariesArgs = {
  objects: Array<userAccessSummariesInsertInput>;
};


/** mutation root */
export type mutation_rootbulkInsertUserInvitationsArgs = {
  objects: Array<userInvitationsInsertInput>;
  onConflict?: InputMaybe<userInvitationsOnConflict>;
};


/** mutation root */
export type mutation_rootbulkInsertUserRolesArgs = {
  objects: Array<userRolesInsertInput>;
  onConflict?: InputMaybe<userRolesOnConflict>;
};


/** mutation root */
export type mutation_rootbulkInsertUsersArgs = {
  objects: Array<usersInsertInput>;
  onConflict?: InputMaybe<usersOnConflict>;
};


/** mutation root */
export type mutation_rootbulkInsertUsersRoleBackupsArgs = {
  objects: Array<usersRoleBackupInsertInput>;
};


/** mutation root */
export type mutation_rootbulkInsertUsersSyncArgs = {
  objects: Array<authUsersSyncInsertInput>;
  onConflict?: InputMaybe<authUsersSyncOnConflict>;
};


/** mutation root */
export type mutation_rootbulkInsertWorkSchedulesArgs = {
  objects: Array<workSchedulesInsertInput>;
  onConflict?: InputMaybe<workSchedulesOnConflict>;
};


/** mutation root */
export type mutation_rootbulkUpdateAdjustmentRulesArgs = {
  _set?: InputMaybe<adjustmentRulesSetInput>;
  where: adjustmentRulesBoolExp;
};


/** mutation root */
export type mutation_rootbulkUpdateAppSettingsArgs = {
  _append?: InputMaybe<appSettingsAppendInput>;
  _deleteAtPath?: InputMaybe<appSettingsDeleteAtPathInput>;
  _deleteElem?: InputMaybe<appSettingsDeleteElemInput>;
  _deleteKey?: InputMaybe<appSettingsDeleteKeyInput>;
  _prepend?: InputMaybe<appSettingsPrependInput>;
  _set?: InputMaybe<appSettingsSetInput>;
  where: appSettingsBoolExp;
};


/** mutation root */
export type mutation_rootbulkUpdateAuditLogsArgs = {
  _append?: InputMaybe<auditLogsAppendInput>;
  _deleteAtPath?: InputMaybe<auditLogsDeleteAtPathInput>;
  _deleteElem?: InputMaybe<auditLogsDeleteElemInput>;
  _deleteKey?: InputMaybe<auditLogsDeleteKeyInput>;
  _prepend?: InputMaybe<auditLogsPrependInput>;
  _set?: InputMaybe<auditLogsSetInput>;
  where: auditLogsBoolExp;
};


/** mutation root */
export type mutation_rootbulkUpdateAuthEventsArgs = {
  _append?: InputMaybe<authEventsAppendInput>;
  _deleteAtPath?: InputMaybe<authEventsDeleteAtPathInput>;
  _deleteElem?: InputMaybe<authEventsDeleteElemInput>;
  _deleteKey?: InputMaybe<authEventsDeleteKeyInput>;
  _prepend?: InputMaybe<authEventsPrependInput>;
  _set?: InputMaybe<authEventsSetInput>;
  where: authEventsBoolExp;
};


/** mutation root */
export type mutation_rootbulkUpdateBillingEventLogsArgs = {
  _set?: InputMaybe<billingEventLogsSetInput>;
  where: billingEventLogsBoolExp;
};


/** mutation root */
export type mutation_rootbulkUpdateBillingInvoiceArgs = {
  _inc?: InputMaybe<billingInvoiceIncInput>;
  _set?: InputMaybe<billingInvoiceSetInput>;
  where: billingInvoiceBoolExp;
};


/** mutation root */
export type mutation_rootbulkUpdateBillingItemsArgs = {
  _inc?: InputMaybe<billingItemsIncInput>;
  _set?: InputMaybe<billingItemsSetInput>;
  where: billingItemsBoolExp;
};


/** mutation root */
export type mutation_rootbulkUpdateBillingPlansArgs = {
  _inc?: InputMaybe<billingPlansIncInput>;
  _set?: InputMaybe<billingPlansSetInput>;
  where: billingPlansBoolExp;
};


/** mutation root */
export type mutation_rootbulkUpdateClientBillingAssignmentsArgs = {
  _set?: InputMaybe<clientBillingAssignmentsSetInput>;
  where: clientBillingAssignmentsBoolExp;
};


/** mutation root */
export type mutation_rootbulkUpdateClientExternalSystemsArgs = {
  _set?: InputMaybe<clientExternalSystemsSetInput>;
  where: clientExternalSystemsBoolExp;
};


/** mutation root */
export type mutation_rootbulkUpdateClientsArgs = {
  _set?: InputMaybe<clientsSetInput>;
  where: clientsBoolExp;
};


/** mutation root */
export type mutation_rootbulkUpdateDataAccessLogsArgs = {
  _append?: InputMaybe<dataAccessLogsAppendInput>;
  _deleteAtPath?: InputMaybe<dataAccessLogsDeleteAtPathInput>;
  _deleteElem?: InputMaybe<dataAccessLogsDeleteElemInput>;
  _deleteKey?: InputMaybe<dataAccessLogsDeleteKeyInput>;
  _inc?: InputMaybe<dataAccessLogsIncInput>;
  _prepend?: InputMaybe<dataAccessLogsPrependInput>;
  _set?: InputMaybe<dataAccessLogsSetInput>;
  where: dataAccessLogsBoolExp;
};


/** mutation root */
export type mutation_rootbulkUpdateExternalSystemsArgs = {
  _set?: InputMaybe<externalSystemsSetInput>;
  where: externalSystemsBoolExp;
};


/** mutation root */
export type mutation_rootbulkUpdateFeatureFlagsArgs = {
  _append?: InputMaybe<featureFlagsAppendInput>;
  _deleteAtPath?: InputMaybe<featureFlagsDeleteAtPathInput>;
  _deleteElem?: InputMaybe<featureFlagsDeleteElemInput>;
  _deleteKey?: InputMaybe<featureFlagsDeleteKeyInput>;
  _prepend?: InputMaybe<featureFlagsPrependInput>;
  _set?: InputMaybe<featureFlagsSetInput>;
  where: featureFlagsBoolExp;
};


/** mutation root */
export type mutation_rootbulkUpdateHolidaysArgs = {
  _inc?: InputMaybe<holidaysIncInput>;
  _set?: InputMaybe<holidaysSetInput>;
  where: holidaysBoolExp;
};


/** mutation root */
export type mutation_rootbulkUpdateLatestPayrollVersionResultsArgs = {
  _inc?: InputMaybe<latestPayrollVersionResultsIncInput>;
  _set?: InputMaybe<latestPayrollVersionResultsSetInput>;
  where: latestPayrollVersionResultsBoolExp;
};


/** mutation root */
export type mutation_rootbulkUpdateLeaveArgs = {
  _set?: InputMaybe<leaveSetInput>;
  where: leaveBoolExp;
};


/** mutation root */
export type mutation_rootbulkUpdateNotesArgs = {
  _set?: InputMaybe<notesSetInput>;
  where: notesBoolExp;
};


/** mutation root */
export type mutation_rootbulkUpdatePayrollActivationResultsArgs = {
  _inc?: InputMaybe<payrollActivationResultsIncInput>;
  _set?: InputMaybe<payrollActivationResultsSetInput>;
  where: payrollActivationResultsBoolExp;
};


/** mutation root */
export type mutation_rootbulkUpdatePayrollAssignmentAuditsArgs = {
  _set?: InputMaybe<payrollAssignmentAuditsSetInput>;
  where: payrollAssignmentAuditsBoolExp;
};


/** mutation root */
export type mutation_rootbulkUpdatePayrollAssignmentsArgs = {
  _set?: InputMaybe<payrollAssignmentsSetInput>;
  where: payrollAssignmentsBoolExp;
};


/** mutation root */
export type mutation_rootbulkUpdatePayrollCyclesArgs = {
  _set?: InputMaybe<payrollCyclesSetInput>;
  where: payrollCyclesBoolExp;
};


/** mutation root */
export type mutation_rootbulkUpdatePayrollDateTypesArgs = {
  _set?: InputMaybe<payrollDateTypesSetInput>;
  where: payrollDateTypesBoolExp;
};


/** mutation root */
export type mutation_rootbulkUpdatePayrollDatesArgs = {
  _set?: InputMaybe<payrollDatesSetInput>;
  where: payrollDatesBoolExp;
};


/** mutation root */
export type mutation_rootbulkUpdatePayrollVersionHistoryResultsArgs = {
  _inc?: InputMaybe<payrollVersionHistoryResultsIncInput>;
  _set?: InputMaybe<payrollVersionHistoryResultsSetInput>;
  where: payrollVersionHistoryResultsBoolExp;
};


/** mutation root */
export type mutation_rootbulkUpdatePayrollVersionResultsArgs = {
  _inc?: InputMaybe<payrollVersionResultsIncInput>;
  _set?: InputMaybe<payrollVersionResultsSetInput>;
  where: payrollVersionResultsBoolExp;
};


/** mutation root */
export type mutation_rootbulkUpdatePayrollsArgs = {
  _inc?: InputMaybe<payrollsIncInput>;
  _set?: InputMaybe<payrollsSetInput>;
  where: payrollsBoolExp;
};


/** mutation root */
export type mutation_rootbulkUpdatePermissionAuditLogsArgs = {
  _append?: InputMaybe<permissionAuditLogsAppendInput>;
  _deleteAtPath?: InputMaybe<permissionAuditLogsDeleteAtPathInput>;
  _deleteElem?: InputMaybe<permissionAuditLogsDeleteElemInput>;
  _deleteKey?: InputMaybe<permissionAuditLogsDeleteKeyInput>;
  _prepend?: InputMaybe<permissionAuditLogsPrependInput>;
  _set?: InputMaybe<permissionAuditLogsSetInput>;
  where: permissionAuditLogsBoolExp;
};


/** mutation root */
export type mutation_rootbulkUpdatePermissionChangesArgs = {
  _append?: InputMaybe<permissionChangesAppendInput>;
  _deleteAtPath?: InputMaybe<permissionChangesDeleteAtPathInput>;
  _deleteElem?: InputMaybe<permissionChangesDeleteElemInput>;
  _deleteKey?: InputMaybe<permissionChangesDeleteKeyInput>;
  _prepend?: InputMaybe<permissionChangesPrependInput>;
  _set?: InputMaybe<permissionChangesSetInput>;
  where: permissionChangesBoolExp;
};


/** mutation root */
export type mutation_rootbulkUpdatePermissionOverridesArgs = {
  _append?: InputMaybe<permissionOverridesAppendInput>;
  _deleteAtPath?: InputMaybe<permissionOverridesDeleteAtPathInput>;
  _deleteElem?: InputMaybe<permissionOverridesDeleteElemInput>;
  _deleteKey?: InputMaybe<permissionOverridesDeleteKeyInput>;
  _prepend?: InputMaybe<permissionOverridesPrependInput>;
  _set?: InputMaybe<permissionOverridesSetInput>;
  where: permissionOverridesBoolExp;
};


/** mutation root */
export type mutation_rootbulkUpdatePermissionsArgs = {
  _set?: InputMaybe<permissionsSetInput>;
  where: permissionsBoolExp;
};


/** mutation root */
export type mutation_rootbulkUpdateResourcesArgs = {
  _set?: InputMaybe<resourcesSetInput>;
  where: resourcesBoolExp;
};


/** mutation root */
export type mutation_rootbulkUpdateRolePermissionsArgs = {
  _append?: InputMaybe<rolePermissionsAppendInput>;
  _deleteAtPath?: InputMaybe<rolePermissionsDeleteAtPathInput>;
  _deleteElem?: InputMaybe<rolePermissionsDeleteElemInput>;
  _deleteKey?: InputMaybe<rolePermissionsDeleteKeyInput>;
  _prepend?: InputMaybe<rolePermissionsPrependInput>;
  _set?: InputMaybe<rolePermissionsSetInput>;
  where: rolePermissionsBoolExp;
};


/** mutation root */
export type mutation_rootbulkUpdateRolesArgs = {
  _inc?: InputMaybe<rolesIncInput>;
  _set?: InputMaybe<rolesSetInput>;
  where: rolesBoolExp;
};


/** mutation root */
export type mutation_rootbulkUpdateSlowQueriesArgs = {
  _set?: InputMaybe<slowQueriesSetInput>;
  where: slowQueriesBoolExp;
};


/** mutation root */
export type mutation_rootbulkUpdateUserAccessSummariesArgs = {
  _set?: InputMaybe<userAccessSummariesSetInput>;
  where: userAccessSummariesBoolExp;
};


/** mutation root */
export type mutation_rootbulkUpdateUserInvitationsArgs = {
  _append?: InputMaybe<userInvitationsAppendInput>;
  _deleteAtPath?: InputMaybe<userInvitationsDeleteAtPathInput>;
  _deleteElem?: InputMaybe<userInvitationsDeleteElemInput>;
  _deleteKey?: InputMaybe<userInvitationsDeleteKeyInput>;
  _prepend?: InputMaybe<userInvitationsPrependInput>;
  _set?: InputMaybe<userInvitationsSetInput>;
  where: userInvitationsBoolExp;
};


/** mutation root */
export type mutation_rootbulkUpdateUserRolesArgs = {
  _set?: InputMaybe<userRolesSetInput>;
  where: userRolesBoolExp;
};


/** mutation root */
export type mutation_rootbulkUpdateUsersArgs = {
  _set?: InputMaybe<usersSetInput>;
  where: usersBoolExp;
};


/** mutation root */
export type mutation_rootbulkUpdateUsersRoleBackupsArgs = {
  _set?: InputMaybe<usersRoleBackupSetInput>;
  where: usersRoleBackupBoolExp;
};


/** mutation root */
export type mutation_rootbulkUpdateUsersSyncArgs = {
  _append?: InputMaybe<authUsersSyncAppendInput>;
  _deleteAtPath?: InputMaybe<authUsersSyncDeleteAtPathInput>;
  _deleteElem?: InputMaybe<authUsersSyncDeleteElemInput>;
  _deleteKey?: InputMaybe<authUsersSyncDeleteKeyInput>;
  _prepend?: InputMaybe<authUsersSyncPrependInput>;
  _set?: InputMaybe<authUsersSyncSetInput>;
  where: authUsersSyncBoolExp;
};


/** mutation root */
export type mutation_rootbulkUpdateWorkSchedulesArgs = {
  _inc?: InputMaybe<workSchedulesIncInput>;
  _set?: InputMaybe<workSchedulesSetInput>;
  where: workSchedulesBoolExp;
};


/** mutation root */
export type mutation_rootcheckSuspiciousActivityArgs = {
  timeWindow?: InputMaybe<Scalars['Int']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
};


/** mutation root */
export type mutation_rootcommitPayrollAssignmentsArgs = {
  changes: Array<PayrollAssignmentInput>;
};


/** mutation root */
export type mutation_rootdeleteAdjustmentRuleByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type mutation_rootdeleteAppSettingByIdArgs = {
  id: Scalars['String']['input'];
};


/** mutation root */
export type mutation_rootdeleteAuditLogByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type mutation_rootdeleteAuthEventByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type mutation_rootdeleteBillingEventLogByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type mutation_rootdeleteBillingInvoiceByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type mutation_rootdeleteBillingInvoiceItemArgs = {
  where: BillingInvoiceItemBoolExp;
};


/** mutation root */
export type mutation_rootdeleteBillingInvoiceItemByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type mutation_rootdeleteBillingItemByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type mutation_rootdeleteBillingPlanByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type mutation_rootdeleteClientBillingAssignmentByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type mutation_rootdeleteClientByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type mutation_rootdeleteClientExternalSystemByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type mutation_rootdeleteDataAccessLogByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type mutation_rootdeleteExternalSystemByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type mutation_rootdeleteFeatureFlagByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type mutation_rootdeleteHolidayByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type mutation_rootdeleteLatestPayrollVersionResultByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type mutation_rootdeleteLeaveByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type mutation_rootdeleteNoteByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type mutation_rootdeletePayrollActivationResultByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type mutation_rootdeletePayrollAssignmentAuditByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type mutation_rootdeletePayrollAssignmentByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type mutation_rootdeletePayrollByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type mutation_rootdeletePayrollCycleByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type mutation_rootdeletePayrollDateByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type mutation_rootdeletePayrollDateTypeByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type mutation_rootdeletePayrollVersionHistoryResultByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type mutation_rootdeletePayrollVersionResultByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type mutation_rootdeletePermissionAuditLogByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type mutation_rootdeletePermissionByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type mutation_rootdeletePermissionChangeByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type mutation_rootdeletePermissionOverrideByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type mutation_rootdeleteResourceByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type mutation_rootdeleteRoleByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type mutation_rootdeleteRolePermissionByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type mutation_rootdeleteSlowQueryByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type mutation_rootdeleteUserByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type mutation_rootdeleteUserInvitationByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type mutation_rootdeleteUserRoleByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type mutation_rootdeleteUserSyncByIdArgs = {
  id: Scalars['String']['input'];
};


/** mutation root */
export type mutation_rootdeleteWorkScheduleByIdArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type mutation_rootgenerateComplianceReportArgs = {
  input: ComplianceReportInput;
};


/** mutation root */
export type mutation_rootinsertAdjustmentRuleArgs = {
  object: adjustmentRulesInsertInput;
  onConflict?: InputMaybe<adjustmentRulesOnConflict>;
};


/** mutation root */
export type mutation_rootinsertAppSettingArgs = {
  object: appSettingsInsertInput;
  onConflict?: InputMaybe<appSettingsOnConflict>;
};


/** mutation root */
export type mutation_rootinsertAuditLogArgs = {
  object: auditLogsInsertInput;
  onConflict?: InputMaybe<auditLogsOnConflict>;
};


/** mutation root */
export type mutation_rootinsertAuthEventArgs = {
  object: authEventsInsertInput;
  onConflict?: InputMaybe<authEventsOnConflict>;
};


/** mutation root */
export type mutation_rootinsertBillingEventLogArgs = {
  object: billingEventLogsInsertInput;
  onConflict?: InputMaybe<billingEventLogsOnConflict>;
};


/** mutation root */
export type mutation_rootinsertBillingInvoiceArgs = {
  object: billingInvoiceInsertInput;
  onConflict?: InputMaybe<billingInvoiceOnConflict>;
};


/** mutation root */
export type mutation_rootinsertBillingInvoiceItemArgs = {
  objects: Array<BillingInvoiceItemInsertInput>;
  onConflict?: InputMaybe<BillingInvoiceItemOnConflict>;
};


/** mutation root */
export type mutation_rootinsertBillingInvoiceItemOneArgs = {
  object: BillingInvoiceItemInsertInput;
  onConflict?: InputMaybe<BillingInvoiceItemOnConflict>;
};


/** mutation root */
export type mutation_rootinsertBillingItemArgs = {
  object: billingItemsInsertInput;
  onConflict?: InputMaybe<billingItemsOnConflict>;
};


/** mutation root */
export type mutation_rootinsertBillingPlanArgs = {
  object: billingPlansInsertInput;
  onConflict?: InputMaybe<billingPlansOnConflict>;
};


/** mutation root */
export type mutation_rootinsertClientArgs = {
  object: clientsInsertInput;
  onConflict?: InputMaybe<clientsOnConflict>;
};


/** mutation root */
export type mutation_rootinsertClientBillingAssignmentArgs = {
  object: clientBillingAssignmentsInsertInput;
  onConflict?: InputMaybe<clientBillingAssignmentsOnConflict>;
};


/** mutation root */
export type mutation_rootinsertClientExternalSystemArgs = {
  object: clientExternalSystemsInsertInput;
  onConflict?: InputMaybe<clientExternalSystemsOnConflict>;
};


/** mutation root */
export type mutation_rootinsertDataAccessLogArgs = {
  object: dataAccessLogsInsertInput;
  onConflict?: InputMaybe<dataAccessLogsOnConflict>;
};


/** mutation root */
export type mutation_rootinsertExternalSystemArgs = {
  object: externalSystemsInsertInput;
  onConflict?: InputMaybe<externalSystemsOnConflict>;
};


/** mutation root */
export type mutation_rootinsertFeatureFlagArgs = {
  object: featureFlagsInsertInput;
  onConflict?: InputMaybe<featureFlagsOnConflict>;
};


/** mutation root */
export type mutation_rootinsertHolidayArgs = {
  object: holidaysInsertInput;
  onConflict?: InputMaybe<holidaysOnConflict>;
};


/** mutation root */
export type mutation_rootinsertLatestPayrollVersionResultArgs = {
  object: latestPayrollVersionResultsInsertInput;
  onConflict?: InputMaybe<latestPayrollVersionResultsOnConflict>;
};


/** mutation root */
export type mutation_rootinsertLeaveArgs = {
  object: leaveInsertInput;
  onConflict?: InputMaybe<leaveOnConflict>;
};


/** mutation root */
export type mutation_rootinsertNoteArgs = {
  object: notesInsertInput;
  onConflict?: InputMaybe<notesOnConflict>;
};


/** mutation root */
export type mutation_rootinsertPayrollArgs = {
  object: payrollsInsertInput;
  onConflict?: InputMaybe<payrollsOnConflict>;
};


/** mutation root */
export type mutation_rootinsertPayrollActivationResultArgs = {
  object: payrollActivationResultsInsertInput;
  onConflict?: InputMaybe<payrollActivationResultsOnConflict>;
};


/** mutation root */
export type mutation_rootinsertPayrollAssignmentArgs = {
  object: payrollAssignmentsInsertInput;
  onConflict?: InputMaybe<payrollAssignmentsOnConflict>;
};


/** mutation root */
export type mutation_rootinsertPayrollAssignmentAuditArgs = {
  object: payrollAssignmentAuditsInsertInput;
  onConflict?: InputMaybe<payrollAssignmentAuditsOnConflict>;
};


/** mutation root */
export type mutation_rootinsertPayrollCycleArgs = {
  object: payrollCyclesInsertInput;
  onConflict?: InputMaybe<payrollCyclesOnConflict>;
};


/** mutation root */
export type mutation_rootinsertPayrollDateArgs = {
  object: payrollDatesInsertInput;
  onConflict?: InputMaybe<payrollDatesOnConflict>;
};


/** mutation root */
export type mutation_rootinsertPayrollDateTypeArgs = {
  object: payrollDateTypesInsertInput;
  onConflict?: InputMaybe<payrollDateTypesOnConflict>;
};


/** mutation root */
export type mutation_rootinsertPayrollVersionHistoryResultArgs = {
  object: payrollVersionHistoryResultsInsertInput;
  onConflict?: InputMaybe<payrollVersionHistoryResultsOnConflict>;
};


/** mutation root */
export type mutation_rootinsertPayrollVersionResultArgs = {
  object: payrollVersionResultsInsertInput;
  onConflict?: InputMaybe<payrollVersionResultsOnConflict>;
};


/** mutation root */
export type mutation_rootinsertPermissionArgs = {
  object: permissionsInsertInput;
  onConflict?: InputMaybe<permissionsOnConflict>;
};


/** mutation root */
export type mutation_rootinsertPermissionAuditLogArgs = {
  object: permissionAuditLogsInsertInput;
  onConflict?: InputMaybe<permissionAuditLogsOnConflict>;
};


/** mutation root */
export type mutation_rootinsertPermissionChangeArgs = {
  object: permissionChangesInsertInput;
  onConflict?: InputMaybe<permissionChangesOnConflict>;
};


/** mutation root */
export type mutation_rootinsertPermissionOverrideArgs = {
  object: permissionOverridesInsertInput;
  onConflict?: InputMaybe<permissionOverridesOnConflict>;
};


/** mutation root */
export type mutation_rootinsertResourceArgs = {
  object: resourcesInsertInput;
  onConflict?: InputMaybe<resourcesOnConflict>;
};


/** mutation root */
export type mutation_rootinsertRoleArgs = {
  object: rolesInsertInput;
  onConflict?: InputMaybe<rolesOnConflict>;
};


/** mutation root */
export type mutation_rootinsertRolePermissionArgs = {
  object: rolePermissionsInsertInput;
  onConflict?: InputMaybe<rolePermissionsOnConflict>;
};


/** mutation root */
export type mutation_rootinsertSlowQueryArgs = {
  object: slowQueriesInsertInput;
  onConflict?: InputMaybe<slowQueriesOnConflict>;
};


/** mutation root */
export type mutation_rootinsertUserArgs = {
  object: usersInsertInput;
  onConflict?: InputMaybe<usersOnConflict>;
};


/** mutation root */
export type mutation_rootinsertUserAccessSummaryArgs = {
  object: userAccessSummariesInsertInput;
};


/** mutation root */
export type mutation_rootinsertUserInvitationArgs = {
  object: userInvitationsInsertInput;
  onConflict?: InputMaybe<userInvitationsOnConflict>;
};


/** mutation root */
export type mutation_rootinsertUserRoleArgs = {
  object: userRolesInsertInput;
  onConflict?: InputMaybe<userRolesOnConflict>;
};


/** mutation root */
export type mutation_rootinsertUserSyncArgs = {
  object: authUsersSyncInsertInput;
  onConflict?: InputMaybe<authUsersSyncOnConflict>;
};


/** mutation root */
export type mutation_rootinsertUsersRoleBackupArgs = {
  object: usersRoleBackupInsertInput;
};


/** mutation root */
export type mutation_rootinsertWorkScheduleArgs = {
  object: workSchedulesInsertInput;
  onConflict?: InputMaybe<workSchedulesOnConflict>;
};


/** mutation root */
export type mutation_rootlogAuditEventArgs = {
  event: AuditEventInput;
};


/** mutation root */
export type mutation_rootupdateAdjustmentRuleByIdArgs = {
  _set?: InputMaybe<adjustmentRulesSetInput>;
  pkColumns: adjustmentRulesPkColumnsInput;
};


/** mutation root */
export type mutation_rootupdateAdjustmentRulesManyArgs = {
  updates: Array<adjustmentRulesUpdates>;
};


/** mutation root */
export type mutation_rootupdateAppSettingByIdArgs = {
  _append?: InputMaybe<appSettingsAppendInput>;
  _deleteAtPath?: InputMaybe<appSettingsDeleteAtPathInput>;
  _deleteElem?: InputMaybe<appSettingsDeleteElemInput>;
  _deleteKey?: InputMaybe<appSettingsDeleteKeyInput>;
  _prepend?: InputMaybe<appSettingsPrependInput>;
  _set?: InputMaybe<appSettingsSetInput>;
  pkColumns: appSettingsPkColumnsInput;
};


/** mutation root */
export type mutation_rootupdateAppSettingsManyArgs = {
  updates: Array<appSettingsUpdates>;
};


/** mutation root */
export type mutation_rootupdateAuditLogByIdArgs = {
  _append?: InputMaybe<auditLogsAppendInput>;
  _deleteAtPath?: InputMaybe<auditLogsDeleteAtPathInput>;
  _deleteElem?: InputMaybe<auditLogsDeleteElemInput>;
  _deleteKey?: InputMaybe<auditLogsDeleteKeyInput>;
  _prepend?: InputMaybe<auditLogsPrependInput>;
  _set?: InputMaybe<auditLogsSetInput>;
  pkColumns: auditLogsPkColumnsInput;
};


/** mutation root */
export type mutation_rootupdateAuditLogsManyArgs = {
  updates: Array<auditLogsUpdates>;
};


/** mutation root */
export type mutation_rootupdateAuthEventByIdArgs = {
  _append?: InputMaybe<authEventsAppendInput>;
  _deleteAtPath?: InputMaybe<authEventsDeleteAtPathInput>;
  _deleteElem?: InputMaybe<authEventsDeleteElemInput>;
  _deleteKey?: InputMaybe<authEventsDeleteKeyInput>;
  _prepend?: InputMaybe<authEventsPrependInput>;
  _set?: InputMaybe<authEventsSetInput>;
  pkColumns: authEventsPkColumnsInput;
};


/** mutation root */
export type mutation_rootupdateAuthEventsManyArgs = {
  updates: Array<authEventsUpdates>;
};


/** mutation root */
export type mutation_rootupdateAuthUsersSyncManyArgs = {
  updates: Array<authUsersSyncUpdates>;
};


/** mutation root */
export type mutation_rootupdateBillingEventLogByIdArgs = {
  _set?: InputMaybe<billingEventLogsSetInput>;
  pkColumns: billingEventLogsPkColumnsInput;
};


/** mutation root */
export type mutation_rootupdateBillingEventLogsManyArgs = {
  updates: Array<billingEventLogsUpdates>;
};


/** mutation root */
export type mutation_rootupdateBillingInvoiceByIdArgs = {
  _inc?: InputMaybe<billingInvoiceIncInput>;
  _set?: InputMaybe<billingInvoiceSetInput>;
  pkColumns: billingInvoicePkColumnsInput;
};


/** mutation root */
export type mutation_rootupdateBillingInvoiceItemArgs = {
  _inc?: InputMaybe<BillingInvoiceItemIncInput>;
  _set?: InputMaybe<BillingInvoiceItemSetInput>;
  where: BillingInvoiceItemBoolExp;
};


/** mutation root */
export type mutation_rootupdateBillingInvoiceItemByPkArgs = {
  _inc?: InputMaybe<BillingInvoiceItemIncInput>;
  _set?: InputMaybe<BillingInvoiceItemSetInput>;
  pkColumns: BillingInvoiceItemPkColumnsInput;
};


/** mutation root */
export type mutation_rootupdateBillingInvoiceItemManyArgs = {
  updates: Array<BillingInvoiceItemUpdates>;
};


/** mutation root */
export type mutation_rootupdateBillingInvoiceManyArgs = {
  updates: Array<billingInvoiceUpdates>;
};


/** mutation root */
export type mutation_rootupdateBillingItemByIdArgs = {
  _inc?: InputMaybe<billingItemsIncInput>;
  _set?: InputMaybe<billingItemsSetInput>;
  pkColumns: billingItemsPkColumnsInput;
};


/** mutation root */
export type mutation_rootupdateBillingItemsManyArgs = {
  updates: Array<billingItemsUpdates>;
};


/** mutation root */
export type mutation_rootupdateBillingPlanByIdArgs = {
  _inc?: InputMaybe<billingPlansIncInput>;
  _set?: InputMaybe<billingPlansSetInput>;
  pkColumns: billingPlansPkColumnsInput;
};


/** mutation root */
export type mutation_rootupdateBillingPlansManyArgs = {
  updates: Array<billingPlansUpdates>;
};


/** mutation root */
export type mutation_rootupdateClientBillingAssignmentByIdArgs = {
  _set?: InputMaybe<clientBillingAssignmentsSetInput>;
  pkColumns: clientBillingAssignmentsPkColumnsInput;
};


/** mutation root */
export type mutation_rootupdateClientBillingAssignmentsManyArgs = {
  updates: Array<clientBillingAssignmentsUpdates>;
};


/** mutation root */
export type mutation_rootupdateClientByIdArgs = {
  _set?: InputMaybe<clientsSetInput>;
  pkColumns: clientsPkColumnsInput;
};


/** mutation root */
export type mutation_rootupdateClientExternalSystemByIdArgs = {
  _set?: InputMaybe<clientExternalSystemsSetInput>;
  pkColumns: clientExternalSystemsPkColumnsInput;
};


/** mutation root */
export type mutation_rootupdateClientExternalSystemsManyArgs = {
  updates: Array<clientExternalSystemsUpdates>;
};


/** mutation root */
export type mutation_rootupdateClientsManyArgs = {
  updates: Array<clientsUpdates>;
};


/** mutation root */
export type mutation_rootupdateDataAccessLogByIdArgs = {
  _append?: InputMaybe<dataAccessLogsAppendInput>;
  _deleteAtPath?: InputMaybe<dataAccessLogsDeleteAtPathInput>;
  _deleteElem?: InputMaybe<dataAccessLogsDeleteElemInput>;
  _deleteKey?: InputMaybe<dataAccessLogsDeleteKeyInput>;
  _inc?: InputMaybe<dataAccessLogsIncInput>;
  _prepend?: InputMaybe<dataAccessLogsPrependInput>;
  _set?: InputMaybe<dataAccessLogsSetInput>;
  pkColumns: dataAccessLogsPkColumnsInput;
};


/** mutation root */
export type mutation_rootupdateDataAccessLogsManyArgs = {
  updates: Array<dataAccessLogsUpdates>;
};


/** mutation root */
export type mutation_rootupdateExternalSystemByIdArgs = {
  _set?: InputMaybe<externalSystemsSetInput>;
  pkColumns: externalSystemsPkColumnsInput;
};


/** mutation root */
export type mutation_rootupdateExternalSystemsManyArgs = {
  updates: Array<externalSystemsUpdates>;
};


/** mutation root */
export type mutation_rootupdateFeatureFlagByIdArgs = {
  _append?: InputMaybe<featureFlagsAppendInput>;
  _deleteAtPath?: InputMaybe<featureFlagsDeleteAtPathInput>;
  _deleteElem?: InputMaybe<featureFlagsDeleteElemInput>;
  _deleteKey?: InputMaybe<featureFlagsDeleteKeyInput>;
  _prepend?: InputMaybe<featureFlagsPrependInput>;
  _set?: InputMaybe<featureFlagsSetInput>;
  pkColumns: featureFlagsPkColumnsInput;
};


/** mutation root */
export type mutation_rootupdateFeatureFlagsManyArgs = {
  updates: Array<featureFlagsUpdates>;
};


/** mutation root */
export type mutation_rootupdateHolidayByIdArgs = {
  _inc?: InputMaybe<holidaysIncInput>;
  _set?: InputMaybe<holidaysSetInput>;
  pkColumns: holidaysPkColumnsInput;
};


/** mutation root */
export type mutation_rootupdateHolidaysManyArgs = {
  updates: Array<holidaysUpdates>;
};


/** mutation root */
export type mutation_rootupdateLatestPayrollVersionResultByIdArgs = {
  _inc?: InputMaybe<latestPayrollVersionResultsIncInput>;
  _set?: InputMaybe<latestPayrollVersionResultsSetInput>;
  pkColumns: latestPayrollVersionResultsPkColumnsInput;
};


/** mutation root */
export type mutation_rootupdateLatestPayrollVersionResultsManyArgs = {
  updates: Array<latestPayrollVersionResultsUpdates>;
};


/** mutation root */
export type mutation_rootupdateLeaveByIdArgs = {
  _set?: InputMaybe<leaveSetInput>;
  pkColumns: leavePkColumnsInput;
};


/** mutation root */
export type mutation_rootupdateLeaveManyArgs = {
  updates: Array<leaveUpdates>;
};


/** mutation root */
export type mutation_rootupdateNoteByIdArgs = {
  _set?: InputMaybe<notesSetInput>;
  pkColumns: notesPkColumnsInput;
};


/** mutation root */
export type mutation_rootupdateNotesManyArgs = {
  updates: Array<notesUpdates>;
};


/** mutation root */
export type mutation_rootupdatePayrollActivationResultByIdArgs = {
  _inc?: InputMaybe<payrollActivationResultsIncInput>;
  _set?: InputMaybe<payrollActivationResultsSetInput>;
  pkColumns: payrollActivationResultsPkColumnsInput;
};


/** mutation root */
export type mutation_rootupdatePayrollActivationResultsManyArgs = {
  updates: Array<payrollActivationResultsUpdates>;
};


/** mutation root */
export type mutation_rootupdatePayrollAssignmentAuditByIdArgs = {
  _set?: InputMaybe<payrollAssignmentAuditsSetInput>;
  pkColumns: payrollAssignmentAuditsPkColumnsInput;
};


/** mutation root */
export type mutation_rootupdatePayrollAssignmentAuditsManyArgs = {
  updates: Array<payrollAssignmentAuditsUpdates>;
};


/** mutation root */
export type mutation_rootupdatePayrollAssignmentByIdArgs = {
  _set?: InputMaybe<payrollAssignmentsSetInput>;
  pkColumns: payrollAssignmentsPkColumnsInput;
};


/** mutation root */
export type mutation_rootupdatePayrollAssignmentsManyArgs = {
  updates: Array<payrollAssignmentsUpdates>;
};


/** mutation root */
export type mutation_rootupdatePayrollByIdArgs = {
  _inc?: InputMaybe<payrollsIncInput>;
  _set?: InputMaybe<payrollsSetInput>;
  pkColumns: payrollsPkColumnsInput;
};


/** mutation root */
export type mutation_rootupdatePayrollCycleByIdArgs = {
  _set?: InputMaybe<payrollCyclesSetInput>;
  pkColumns: payrollCyclesPkColumnsInput;
};


/** mutation root */
export type mutation_rootupdatePayrollCyclesManyArgs = {
  updates: Array<payrollCyclesUpdates>;
};


/** mutation root */
export type mutation_rootupdatePayrollDateByIdArgs = {
  _set?: InputMaybe<payrollDatesSetInput>;
  pkColumns: payrollDatesPkColumnsInput;
};


/** mutation root */
export type mutation_rootupdatePayrollDateTypeByIdArgs = {
  _set?: InputMaybe<payrollDateTypesSetInput>;
  pkColumns: payrollDateTypesPkColumnsInput;
};


/** mutation root */
export type mutation_rootupdatePayrollDateTypesManyArgs = {
  updates: Array<payrollDateTypesUpdates>;
};


/** mutation root */
export type mutation_rootupdatePayrollDatesManyArgs = {
  updates: Array<payrollDatesUpdates>;
};


/** mutation root */
export type mutation_rootupdatePayrollVersionHistoryResultByIdArgs = {
  _inc?: InputMaybe<payrollVersionHistoryResultsIncInput>;
  _set?: InputMaybe<payrollVersionHistoryResultsSetInput>;
  pkColumns: payrollVersionHistoryResultsPkColumnsInput;
};


/** mutation root */
export type mutation_rootupdatePayrollVersionHistoryResultsManyArgs = {
  updates: Array<payrollVersionHistoryResultsUpdates>;
};


/** mutation root */
export type mutation_rootupdatePayrollVersionResultByIdArgs = {
  _inc?: InputMaybe<payrollVersionResultsIncInput>;
  _set?: InputMaybe<payrollVersionResultsSetInput>;
  pkColumns: payrollVersionResultsPkColumnsInput;
};


/** mutation root */
export type mutation_rootupdatePayrollVersionResultsManyArgs = {
  updates: Array<payrollVersionResultsUpdates>;
};


/** mutation root */
export type mutation_rootupdatePayrollsManyArgs = {
  updates: Array<payrollsUpdates>;
};


/** mutation root */
export type mutation_rootupdatePermissionAuditLogByIdArgs = {
  _append?: InputMaybe<permissionAuditLogsAppendInput>;
  _deleteAtPath?: InputMaybe<permissionAuditLogsDeleteAtPathInput>;
  _deleteElem?: InputMaybe<permissionAuditLogsDeleteElemInput>;
  _deleteKey?: InputMaybe<permissionAuditLogsDeleteKeyInput>;
  _prepend?: InputMaybe<permissionAuditLogsPrependInput>;
  _set?: InputMaybe<permissionAuditLogsSetInput>;
  pkColumns: permissionAuditLogsPkColumnsInput;
};


/** mutation root */
export type mutation_rootupdatePermissionAuditLogsManyArgs = {
  updates: Array<permissionAuditLogsUpdates>;
};


/** mutation root */
export type mutation_rootupdatePermissionByIdArgs = {
  _set?: InputMaybe<permissionsSetInput>;
  pkColumns: permissionsPkColumnsInput;
};


/** mutation root */
export type mutation_rootupdatePermissionChangeByIdArgs = {
  _append?: InputMaybe<permissionChangesAppendInput>;
  _deleteAtPath?: InputMaybe<permissionChangesDeleteAtPathInput>;
  _deleteElem?: InputMaybe<permissionChangesDeleteElemInput>;
  _deleteKey?: InputMaybe<permissionChangesDeleteKeyInput>;
  _prepend?: InputMaybe<permissionChangesPrependInput>;
  _set?: InputMaybe<permissionChangesSetInput>;
  pkColumns: permissionChangesPkColumnsInput;
};


/** mutation root */
export type mutation_rootupdatePermissionChangesManyArgs = {
  updates: Array<permissionChangesUpdates>;
};


/** mutation root */
export type mutation_rootupdatePermissionOverrideByIdArgs = {
  _append?: InputMaybe<permissionOverridesAppendInput>;
  _deleteAtPath?: InputMaybe<permissionOverridesDeleteAtPathInput>;
  _deleteElem?: InputMaybe<permissionOverridesDeleteElemInput>;
  _deleteKey?: InputMaybe<permissionOverridesDeleteKeyInput>;
  _prepend?: InputMaybe<permissionOverridesPrependInput>;
  _set?: InputMaybe<permissionOverridesSetInput>;
  pkColumns: permissionOverridesPkColumnsInput;
};


/** mutation root */
export type mutation_rootupdatePermissionOverridesManyArgs = {
  updates: Array<permissionOverridesUpdates>;
};


/** mutation root */
export type mutation_rootupdatePermissionsManyArgs = {
  updates: Array<permissionsUpdates>;
};


/** mutation root */
export type mutation_rootupdateResourceByIdArgs = {
  _set?: InputMaybe<resourcesSetInput>;
  pkColumns: resourcesPkColumnsInput;
};


/** mutation root */
export type mutation_rootupdateResourcesManyArgs = {
  updates: Array<resourcesUpdates>;
};


/** mutation root */
export type mutation_rootupdateRoleByIdArgs = {
  _inc?: InputMaybe<rolesIncInput>;
  _set?: InputMaybe<rolesSetInput>;
  pkColumns: rolesPkColumnsInput;
};


/** mutation root */
export type mutation_rootupdateRolePermissionByIdArgs = {
  _append?: InputMaybe<rolePermissionsAppendInput>;
  _deleteAtPath?: InputMaybe<rolePermissionsDeleteAtPathInput>;
  _deleteElem?: InputMaybe<rolePermissionsDeleteElemInput>;
  _deleteKey?: InputMaybe<rolePermissionsDeleteKeyInput>;
  _prepend?: InputMaybe<rolePermissionsPrependInput>;
  _set?: InputMaybe<rolePermissionsSetInput>;
  pkColumns: rolePermissionsPkColumnsInput;
};


/** mutation root */
export type mutation_rootupdateRolePermissionsManyArgs = {
  updates: Array<rolePermissionsUpdates>;
};


/** mutation root */
export type mutation_rootupdateRolesManyArgs = {
  updates: Array<rolesUpdates>;
};


/** mutation root */
export type mutation_rootupdateSlowQueriesManyArgs = {
  updates: Array<slowQueriesUpdates>;
};


/** mutation root */
export type mutation_rootupdateSlowQueryByIdArgs = {
  _set?: InputMaybe<slowQueriesSetInput>;
  pkColumns: slowQueriesPkColumnsInput;
};


/** mutation root */
export type mutation_rootupdateUserAccessSummariesManyArgs = {
  updates: Array<userAccessSummariesUpdates>;
};


/** mutation root */
export type mutation_rootupdateUserByIdArgs = {
  _set?: InputMaybe<usersSetInput>;
  pkColumns: usersPkColumnsInput;
};


/** mutation root */
export type mutation_rootupdateUserInvitationByIdArgs = {
  _append?: InputMaybe<userInvitationsAppendInput>;
  _deleteAtPath?: InputMaybe<userInvitationsDeleteAtPathInput>;
  _deleteElem?: InputMaybe<userInvitationsDeleteElemInput>;
  _deleteKey?: InputMaybe<userInvitationsDeleteKeyInput>;
  _prepend?: InputMaybe<userInvitationsPrependInput>;
  _set?: InputMaybe<userInvitationsSetInput>;
  pkColumns: userInvitationsPkColumnsInput;
};


/** mutation root */
export type mutation_rootupdateUserInvitationsManyArgs = {
  updates: Array<userInvitationsUpdates>;
};


/** mutation root */
export type mutation_rootupdateUserRoleByIdArgs = {
  _set?: InputMaybe<userRolesSetInput>;
  pkColumns: userRolesPkColumnsInput;
};


/** mutation root */
export type mutation_rootupdateUserRolesManyArgs = {
  updates: Array<userRolesUpdates>;
};


/** mutation root */
export type mutation_rootupdateUserSyncByIdArgs = {
  _append?: InputMaybe<authUsersSyncAppendInput>;
  _deleteAtPath?: InputMaybe<authUsersSyncDeleteAtPathInput>;
  _deleteElem?: InputMaybe<authUsersSyncDeleteElemInput>;
  _deleteKey?: InputMaybe<authUsersSyncDeleteKeyInput>;
  _prepend?: InputMaybe<authUsersSyncPrependInput>;
  _set?: InputMaybe<authUsersSyncSetInput>;
  pkColumns: authUsersSyncPkColumnsInput;
};


/** mutation root */
export type mutation_rootupdateUsersManyArgs = {
  updates: Array<usersUpdates>;
};


/** mutation root */
export type mutation_rootupdateUsersRoleBackupManyArgs = {
  updates: Array<usersRoleBackupUpdates>;
};


/** mutation root */
export type mutation_rootupdateWorkScheduleByIdArgs = {
  _inc?: InputMaybe<workSchedulesIncInput>;
  _set?: InputMaybe<workSchedulesSetInput>;
  pkColumns: workSchedulesPkColumnsInput;
};


/** mutation root */
export type mutation_rootupdateWorkSchedulesManyArgs = {
  updates: Array<workSchedulesUpdates>;
};

/** columns and relationships of "notes" */
export type notes = {
  __typename?: 'notes';
  /** An object relationship */
  authorUser?: Maybe<users>;
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
  notesByClient: Array<clients>;
  /** An aggregate relationship */
  notesByClientAggregate: clientsAggregate;
  /** An array relationship */
  notesByPayroll: Array<payrolls>;
  /** An aggregate relationship */
  notesByPayrollAggregate: payrollsAggregate;
  /** Timestamp when the note was last updated */
  updatedAt?: Maybe<Scalars['timestamp']['output']>;
  /** User who created the note */
  userId?: Maybe<Scalars['uuid']['output']>;
};


/** columns and relationships of "notes" */
export type notesnotesByClientArgs = {
  distinctOn?: InputMaybe<Array<clientsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<clientsOrderBy>>;
  where?: InputMaybe<clientsBoolExp>;
};


/** columns and relationships of "notes" */
export type notesnotesByClientAggregateArgs = {
  distinctOn?: InputMaybe<Array<clientsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<clientsOrderBy>>;
  where?: InputMaybe<clientsBoolExp>;
};


/** columns and relationships of "notes" */
export type notesnotesByPayrollArgs = {
  distinctOn?: InputMaybe<Array<payrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollsOrderBy>>;
  where?: InputMaybe<payrollsBoolExp>;
};


/** columns and relationships of "notes" */
export type notesnotesByPayrollAggregateArgs = {
  distinctOn?: InputMaybe<Array<payrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollsOrderBy>>;
  where?: InputMaybe<payrollsBoolExp>;
};

/** aggregated selection of "notes" */
export type notesAggregate = {
  __typename?: 'notesAggregate';
  aggregate?: Maybe<notesAggregateFields>;
  nodes: Array<notes>;
};

export type notesAggregateBoolExp = {
  bool_and?: InputMaybe<notesAggregateBoolExpBool_and>;
  bool_or?: InputMaybe<notesAggregateBoolExpBool_or>;
  count?: InputMaybe<notesAggregateBoolExpCount>;
};

export type notesAggregateBoolExpBool_and = {
  arguments: notesSelectColumnNotesAggregateBoolExpBool_andArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<notesBoolExp>;
  predicate: BooleanComparisonExp;
};

export type notesAggregateBoolExpBool_or = {
  arguments: notesSelectColumnNotesAggregateBoolExpBool_orArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<notesBoolExp>;
  predicate: BooleanComparisonExp;
};

export type notesAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<notesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<notesBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "notes" */
export type notesAggregateFields = {
  __typename?: 'notesAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<notesMaxFields>;
  min?: Maybe<notesMinFields>;
};


/** aggregate fields of "notes" */
export type notesAggregateFieldscountArgs = {
  columns?: InputMaybe<Array<notesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "notes" */
export type notesAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<notesMaxOrderBy>;
  min?: InputMaybe<notesMinOrderBy>;
};

/** input type for inserting array relation for remote table "notes" */
export type notesArrRelInsertInput = {
  data: Array<notesInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<notesOnConflict>;
};

/** Boolean expression to filter rows from the table "notes". All fields are combined with a logical 'AND'. */
export type notesBoolExp = {
  _and?: InputMaybe<Array<notesBoolExp>>;
  _not?: InputMaybe<notesBoolExp>;
  _or?: InputMaybe<Array<notesBoolExp>>;
  authorUser?: InputMaybe<usersBoolExp>;
  content?: InputMaybe<StringComparisonExp>;
  createdAt?: InputMaybe<TimestampComparisonExp>;
  entityId?: InputMaybe<UuidComparisonExp>;
  entityType?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  isImportant?: InputMaybe<BooleanComparisonExp>;
  notesByClient?: InputMaybe<clientsBoolExp>;
  notesByClientAggregate?: InputMaybe<clientsAggregateBoolExp>;
  notesByPayroll?: InputMaybe<payrollsBoolExp>;
  notesByPayrollAggregate?: InputMaybe<payrollsAggregateBoolExp>;
  updatedAt?: InputMaybe<TimestampComparisonExp>;
  userId?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "notes" */
export type notesConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'notes_pkey';

/** input type for inserting data into table "notes" */
export type notesInsertInput = {
  authorUser?: InputMaybe<usersObjRelInsertInput>;
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
  notesByClient?: InputMaybe<clientsArrRelInsertInput>;
  notesByPayroll?: InputMaybe<payrollsArrRelInsertInput>;
  /** Timestamp when the note was last updated */
  updatedAt?: InputMaybe<Scalars['timestamp']['input']>;
  /** User who created the note */
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type notesMaxFields = {
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
export type notesMaxOrderBy = {
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
export type notesMinFields = {
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
export type notesMinOrderBy = {
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
export type notesMutationResponse = {
  __typename?: 'notesMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<notes>;
};

/** on_conflict condition type for table "notes" */
export type notesOnConflict = {
  constraint: notesConstraint;
  updateColumns?: Array<notesUpdateColumn>;
  where?: InputMaybe<notesBoolExp>;
};

/** Ordering options when selecting data from "notes". */
export type notesOrderBy = {
  authorUser?: InputMaybe<usersOrderBy>;
  content?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  entityId?: InputMaybe<OrderBy>;
  entityType?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  isImportant?: InputMaybe<OrderBy>;
  notesByClientAggregate?: InputMaybe<clientsAggregateOrderBy>;
  notesByPayrollAggregate?: InputMaybe<payrollsAggregateOrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: notes */
export type notesPkColumnsInput = {
  /** Unique identifier for the note */
  id: Scalars['uuid']['input'];
};

/** select columns of table "notes" */
export type notesSelectColumn =
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
  | 'userId';

/** select "notesAggregateBoolExpBool_andArgumentsColumns" columns of table "notes" */
export type notesSelectColumnNotesAggregateBoolExpBool_andArgumentsColumns =
  /** column name */
  | 'isImportant';

/** select "notesAggregateBoolExpBool_orArgumentsColumns" columns of table "notes" */
export type notesSelectColumnNotesAggregateBoolExpBool_orArgumentsColumns =
  /** column name */
  | 'isImportant';

/** input type for updating data in table "notes" */
export type notesSetInput = {
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
export type notesStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: notesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type notesStreamCursorValueInput = {
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
export type notesUpdateColumn =
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
  | 'userId';

export type notesUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<notesSetInput>;
  /** filter the rows which have to be updated */
  where: notesBoolExp;
};

/** columns and relationships of "payroll_activation_results" */
export type payrollActivationResults = {
  __typename?: 'payrollActivationResults';
  actionTaken: Scalars['String']['output'];
  executedAt?: Maybe<Scalars['timestamptz']['output']>;
  id: Scalars['uuid']['output'];
  payrollId: Scalars['uuid']['output'];
  versionNumber: Scalars['Int']['output'];
};

export type payrollActivationResultsAggregate = {
  __typename?: 'payrollActivationResultsAggregate';
  aggregate?: Maybe<payrollActivationResultsAggregateFields>;
  nodes: Array<payrollActivationResults>;
};

/** aggregate fields of "payroll_activation_results" */
export type payrollActivationResultsAggregateFields = {
  __typename?: 'payrollActivationResultsAggregateFields';
  avg?: Maybe<payrollActivationResultsAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<payrollActivationResultsMaxFields>;
  min?: Maybe<payrollActivationResultsMinFields>;
  stddev?: Maybe<payrollActivationResultsStddevFields>;
  stddevPop?: Maybe<payrollActivationResultsStddevPopFields>;
  stddevSamp?: Maybe<payrollActivationResultsStddevSampFields>;
  sum?: Maybe<payrollActivationResultsSumFields>;
  varPop?: Maybe<payrollActivationResultsVarPopFields>;
  varSamp?: Maybe<payrollActivationResultsVarSampFields>;
  variance?: Maybe<payrollActivationResultsVarianceFields>;
};


/** aggregate fields of "payroll_activation_results" */
export type payrollActivationResultsAggregateFieldscountArgs = {
  columns?: InputMaybe<Array<payrollActivationResultsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type payrollActivationResultsAvgFields = {
  __typename?: 'payrollActivationResultsAvgFields';
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "payroll_activation_results". All fields are combined with a logical 'AND'. */
export type payrollActivationResultsBoolExp = {
  _and?: InputMaybe<Array<payrollActivationResultsBoolExp>>;
  _not?: InputMaybe<payrollActivationResultsBoolExp>;
  _or?: InputMaybe<Array<payrollActivationResultsBoolExp>>;
  actionTaken?: InputMaybe<StringComparisonExp>;
  executedAt?: InputMaybe<TimestamptzComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  payrollId?: InputMaybe<UuidComparisonExp>;
  versionNumber?: InputMaybe<IntComparisonExp>;
};

/** unique or primary key constraints on table "payroll_activation_results" */
export type payrollActivationResultsConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'payroll_activation_results_pkey';

/** input type for incrementing numeric columns in table "payroll_activation_results" */
export type payrollActivationResultsIncInput = {
  versionNumber?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "payroll_activation_results" */
export type payrollActivationResultsInsertInput = {
  actionTaken?: InputMaybe<Scalars['String']['input']>;
  executedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  payrollId?: InputMaybe<Scalars['uuid']['input']>;
  versionNumber?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate max on columns */
export type payrollActivationResultsMaxFields = {
  __typename?: 'payrollActivationResultsMaxFields';
  actionTaken?: Maybe<Scalars['String']['output']>;
  executedAt?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  payrollId?: Maybe<Scalars['uuid']['output']>;
  versionNumber?: Maybe<Scalars['Int']['output']>;
};

/** aggregate min on columns */
export type payrollActivationResultsMinFields = {
  __typename?: 'payrollActivationResultsMinFields';
  actionTaken?: Maybe<Scalars['String']['output']>;
  executedAt?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  payrollId?: Maybe<Scalars['uuid']['output']>;
  versionNumber?: Maybe<Scalars['Int']['output']>;
};

/** response of any mutation on the table "payroll_activation_results" */
export type payrollActivationResultsMutationResponse = {
  __typename?: 'payrollActivationResultsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<payrollActivationResults>;
};

/** on_conflict condition type for table "payroll_activation_results" */
export type payrollActivationResultsOnConflict = {
  constraint: payrollActivationResultsConstraint;
  updateColumns?: Array<payrollActivationResultsUpdateColumn>;
  where?: InputMaybe<payrollActivationResultsBoolExp>;
};

/** Ordering options when selecting data from "payroll_activation_results". */
export type payrollActivationResultsOrderBy = {
  actionTaken?: InputMaybe<OrderBy>;
  executedAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  payrollId?: InputMaybe<OrderBy>;
  versionNumber?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: payroll_activation_results */
export type payrollActivationResultsPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "payroll_activation_results" */
export type payrollActivationResultsSelectColumn =
  /** column name */
  | 'actionTaken'
  /** column name */
  | 'executedAt'
  /** column name */
  | 'id'
  /** column name */
  | 'payrollId'
  /** column name */
  | 'versionNumber';

/** input type for updating data in table "payroll_activation_results" */
export type payrollActivationResultsSetInput = {
  actionTaken?: InputMaybe<Scalars['String']['input']>;
  executedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  payrollId?: InputMaybe<Scalars['uuid']['input']>;
  versionNumber?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate stddev on columns */
export type payrollActivationResultsStddevFields = {
  __typename?: 'payrollActivationResultsStddevFields';
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddevPop on columns */
export type payrollActivationResultsStddevPopFields = {
  __typename?: 'payrollActivationResultsStddevPopFields';
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddevSamp on columns */
export type payrollActivationResultsStddevSampFields = {
  __typename?: 'payrollActivationResultsStddevSampFields';
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "payrollActivationResults" */
export type payrollActivationResultsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: payrollActivationResultsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type payrollActivationResultsStreamCursorValueInput = {
  actionTaken?: InputMaybe<Scalars['String']['input']>;
  executedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  payrollId?: InputMaybe<Scalars['uuid']['input']>;
  versionNumber?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type payrollActivationResultsSumFields = {
  __typename?: 'payrollActivationResultsSumFields';
  versionNumber?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "payroll_activation_results" */
export type payrollActivationResultsUpdateColumn =
  /** column name */
  | 'actionTaken'
  /** column name */
  | 'executedAt'
  /** column name */
  | 'id'
  /** column name */
  | 'payrollId'
  /** column name */
  | 'versionNumber';

export type payrollActivationResultsUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<payrollActivationResultsIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<payrollActivationResultsSetInput>;
  /** filter the rows which have to be updated */
  where: payrollActivationResultsBoolExp;
};

/** aggregate varPop on columns */
export type payrollActivationResultsVarPopFields = {
  __typename?: 'payrollActivationResultsVarPopFields';
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** aggregate varSamp on columns */
export type payrollActivationResultsVarSampFields = {
  __typename?: 'payrollActivationResultsVarSampFields';
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type payrollActivationResultsVarianceFields = {
  __typename?: 'payrollActivationResultsVarianceFields';
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "payroll_assignment_audit" */
export type payrollAssignmentAudits = {
  __typename?: 'payrollAssignmentAudits';
  assignmentId?: Maybe<Scalars['uuid']['output']>;
  changeReason?: Maybe<Scalars['String']['output']>;
  changedBy?: Maybe<Scalars['uuid']['output']>;
  /** An object relationship */
  changedByUser?: Maybe<users>;
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  /** An object relationship */
  fromConsultant?: Maybe<users>;
  fromConsultantId?: Maybe<Scalars['uuid']['output']>;
  id: Scalars['uuid']['output'];
  /** An object relationship */
  payrollAssignment?: Maybe<payrollAssignments>;
  /** An object relationship */
  payrollDate: payrollDates;
  payrollDateId: Scalars['uuid']['output'];
  /** An object relationship */
  toConsultant: users;
  toConsultantId: Scalars['uuid']['output'];
};

/** aggregated selection of "payroll_assignment_audit" */
export type payrollAssignmentAuditsAggregate = {
  __typename?: 'payrollAssignmentAuditsAggregate';
  aggregate?: Maybe<payrollAssignmentAuditsAggregateFields>;
  nodes: Array<payrollAssignmentAudits>;
};

export type payrollAssignmentAuditsAggregateBoolExp = {
  count?: InputMaybe<payrollAssignmentAuditsAggregateBoolExpCount>;
};

export type payrollAssignmentAuditsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<payrollAssignmentAuditsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<payrollAssignmentAuditsBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "payroll_assignment_audit" */
export type payrollAssignmentAuditsAggregateFields = {
  __typename?: 'payrollAssignmentAuditsAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<payrollAssignmentAuditsMaxFields>;
  min?: Maybe<payrollAssignmentAuditsMinFields>;
};


/** aggregate fields of "payroll_assignment_audit" */
export type payrollAssignmentAuditsAggregateFieldscountArgs = {
  columns?: InputMaybe<Array<payrollAssignmentAuditsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "payroll_assignment_audit" */
export type payrollAssignmentAuditsAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<payrollAssignmentAuditsMaxOrderBy>;
  min?: InputMaybe<payrollAssignmentAuditsMinOrderBy>;
};

/** input type for inserting array relation for remote table "payroll_assignment_audit" */
export type payrollAssignmentAuditsArrRelInsertInput = {
  data: Array<payrollAssignmentAuditsInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<payrollAssignmentAuditsOnConflict>;
};

/** Boolean expression to filter rows from the table "payroll_assignment_audit". All fields are combined with a logical 'AND'. */
export type payrollAssignmentAuditsBoolExp = {
  _and?: InputMaybe<Array<payrollAssignmentAuditsBoolExp>>;
  _not?: InputMaybe<payrollAssignmentAuditsBoolExp>;
  _or?: InputMaybe<Array<payrollAssignmentAuditsBoolExp>>;
  assignmentId?: InputMaybe<UuidComparisonExp>;
  changeReason?: InputMaybe<StringComparisonExp>;
  changedBy?: InputMaybe<UuidComparisonExp>;
  changedByUser?: InputMaybe<usersBoolExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  fromConsultant?: InputMaybe<usersBoolExp>;
  fromConsultantId?: InputMaybe<UuidComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  payrollAssignment?: InputMaybe<payrollAssignmentsBoolExp>;
  payrollDate?: InputMaybe<payrollDatesBoolExp>;
  payrollDateId?: InputMaybe<UuidComparisonExp>;
  toConsultant?: InputMaybe<usersBoolExp>;
  toConsultantId?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "payroll_assignment_audit" */
export type payrollAssignmentAuditsConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'payroll_assignment_audit_pkey';

/** input type for inserting data into table "payroll_assignment_audit" */
export type payrollAssignmentAuditsInsertInput = {
  assignmentId?: InputMaybe<Scalars['uuid']['input']>;
  changeReason?: InputMaybe<Scalars['String']['input']>;
  changedBy?: InputMaybe<Scalars['uuid']['input']>;
  changedByUser?: InputMaybe<usersObjRelInsertInput>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  fromConsultant?: InputMaybe<usersObjRelInsertInput>;
  fromConsultantId?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  payrollAssignment?: InputMaybe<payrollAssignmentsObjRelInsertInput>;
  payrollDate?: InputMaybe<payrollDatesObjRelInsertInput>;
  payrollDateId?: InputMaybe<Scalars['uuid']['input']>;
  toConsultant?: InputMaybe<usersObjRelInsertInput>;
  toConsultantId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type payrollAssignmentAuditsMaxFields = {
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
export type payrollAssignmentAuditsMaxOrderBy = {
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
export type payrollAssignmentAuditsMinFields = {
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
export type payrollAssignmentAuditsMinOrderBy = {
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
export type payrollAssignmentAuditsMutationResponse = {
  __typename?: 'payrollAssignmentAuditsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<payrollAssignmentAudits>;
};

/** on_conflict condition type for table "payroll_assignment_audit" */
export type payrollAssignmentAuditsOnConflict = {
  constraint: payrollAssignmentAuditsConstraint;
  updateColumns?: Array<payrollAssignmentAuditsUpdateColumn>;
  where?: InputMaybe<payrollAssignmentAuditsBoolExp>;
};

/** Ordering options when selecting data from "payroll_assignment_audit". */
export type payrollAssignmentAuditsOrderBy = {
  assignmentId?: InputMaybe<OrderBy>;
  changeReason?: InputMaybe<OrderBy>;
  changedBy?: InputMaybe<OrderBy>;
  changedByUser?: InputMaybe<usersOrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  fromConsultant?: InputMaybe<usersOrderBy>;
  fromConsultantId?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  payrollAssignment?: InputMaybe<payrollAssignmentsOrderBy>;
  payrollDate?: InputMaybe<payrollDatesOrderBy>;
  payrollDateId?: InputMaybe<OrderBy>;
  toConsultant?: InputMaybe<usersOrderBy>;
  toConsultantId?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: payroll_assignment_audit */
export type payrollAssignmentAuditsPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "payroll_assignment_audit" */
export type payrollAssignmentAuditsSelectColumn =
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
  | 'toConsultantId';

/** input type for updating data in table "payroll_assignment_audit" */
export type payrollAssignmentAuditsSetInput = {
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
export type payrollAssignmentAuditsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: payrollAssignmentAuditsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type payrollAssignmentAuditsStreamCursorValueInput = {
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
export type payrollAssignmentAuditsUpdateColumn =
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
  | 'toConsultantId';

export type payrollAssignmentAuditsUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<payrollAssignmentAuditsSetInput>;
  /** filter the rows which have to be updated */
  where: payrollAssignmentAuditsBoolExp;
};

/** columns and relationships of "payroll_assignments" */
export type payrollAssignments = {
  __typename?: 'payrollAssignments';
  assignedBy?: Maybe<Scalars['uuid']['output']>;
  /** An object relationship */
  assignedByUser?: Maybe<users>;
  /** An object relationship */
  assignedConsultant: users;
  assignedDate?: Maybe<Scalars['timestamptz']['output']>;
  consultantId: Scalars['uuid']['output'];
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  id: Scalars['uuid']['output'];
  isBackup?: Maybe<Scalars['Boolean']['output']>;
  /** An object relationship */
  originalConsultant?: Maybe<users>;
  originalConsultantId?: Maybe<Scalars['uuid']['output']>;
  /** An array relationship */
  payrollAssignmentAudits: Array<payrollAssignmentAudits>;
  /** An aggregate relationship */
  payrollAssignmentAuditsAggregate: payrollAssignmentAuditsAggregate;
  /** An object relationship */
  payrollDate: payrollDates;
  payrollDateId: Scalars['uuid']['output'];
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};


/** columns and relationships of "payroll_assignments" */
export type payrollAssignmentspayrollAssignmentAuditsArgs = {
  distinctOn?: InputMaybe<Array<payrollAssignmentAuditsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollAssignmentAuditsOrderBy>>;
  where?: InputMaybe<payrollAssignmentAuditsBoolExp>;
};


/** columns and relationships of "payroll_assignments" */
export type payrollAssignmentspayrollAssignmentAuditsAggregateArgs = {
  distinctOn?: InputMaybe<Array<payrollAssignmentAuditsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollAssignmentAuditsOrderBy>>;
  where?: InputMaybe<payrollAssignmentAuditsBoolExp>;
};

/** aggregated selection of "payroll_assignments" */
export type payrollAssignmentsAggregate = {
  __typename?: 'payrollAssignmentsAggregate';
  aggregate?: Maybe<payrollAssignmentsAggregateFields>;
  nodes: Array<payrollAssignments>;
};

export type payrollAssignmentsAggregateBoolExp = {
  bool_and?: InputMaybe<payrollAssignmentsAggregateBoolExpBool_and>;
  bool_or?: InputMaybe<payrollAssignmentsAggregateBoolExpBool_or>;
  count?: InputMaybe<payrollAssignmentsAggregateBoolExpCount>;
};

export type payrollAssignmentsAggregateBoolExpBool_and = {
  arguments: payrollAssignmentsSelectColumnPayrollAssignmentsAggregateBoolExpBool_andArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<payrollAssignmentsBoolExp>;
  predicate: BooleanComparisonExp;
};

export type payrollAssignmentsAggregateBoolExpBool_or = {
  arguments: payrollAssignmentsSelectColumnPayrollAssignmentsAggregateBoolExpBool_orArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<payrollAssignmentsBoolExp>;
  predicate: BooleanComparisonExp;
};

export type payrollAssignmentsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<payrollAssignmentsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<payrollAssignmentsBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "payroll_assignments" */
export type payrollAssignmentsAggregateFields = {
  __typename?: 'payrollAssignmentsAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<payrollAssignmentsMaxFields>;
  min?: Maybe<payrollAssignmentsMinFields>;
};


/** aggregate fields of "payroll_assignments" */
export type payrollAssignmentsAggregateFieldscountArgs = {
  columns?: InputMaybe<Array<payrollAssignmentsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "payroll_assignments" */
export type payrollAssignmentsAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<payrollAssignmentsMaxOrderBy>;
  min?: InputMaybe<payrollAssignmentsMinOrderBy>;
};

/** input type for inserting array relation for remote table "payroll_assignments" */
export type payrollAssignmentsArrRelInsertInput = {
  data: Array<payrollAssignmentsInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<payrollAssignmentsOnConflict>;
};

/** Boolean expression to filter rows from the table "payroll_assignments". All fields are combined with a logical 'AND'. */
export type payrollAssignmentsBoolExp = {
  _and?: InputMaybe<Array<payrollAssignmentsBoolExp>>;
  _not?: InputMaybe<payrollAssignmentsBoolExp>;
  _or?: InputMaybe<Array<payrollAssignmentsBoolExp>>;
  assignedBy?: InputMaybe<UuidComparisonExp>;
  assignedByUser?: InputMaybe<usersBoolExp>;
  assignedConsultant?: InputMaybe<usersBoolExp>;
  assignedDate?: InputMaybe<TimestamptzComparisonExp>;
  consultantId?: InputMaybe<UuidComparisonExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  isBackup?: InputMaybe<BooleanComparisonExp>;
  originalConsultant?: InputMaybe<usersBoolExp>;
  originalConsultantId?: InputMaybe<UuidComparisonExp>;
  payrollAssignmentAudits?: InputMaybe<payrollAssignmentAuditsBoolExp>;
  payrollAssignmentAuditsAggregate?: InputMaybe<payrollAssignmentAuditsAggregateBoolExp>;
  payrollDate?: InputMaybe<payrollDatesBoolExp>;
  payrollDateId?: InputMaybe<UuidComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "payroll_assignments" */
export type payrollAssignmentsConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'payroll_assignments_pkey'
  /** unique or primary key constraint on columns "payroll_date_id" */
  | 'uq_payroll_assignment_payroll_date';

/** input type for inserting data into table "payroll_assignments" */
export type payrollAssignmentsInsertInput = {
  assignedBy?: InputMaybe<Scalars['uuid']['input']>;
  assignedByUser?: InputMaybe<usersObjRelInsertInput>;
  assignedConsultant?: InputMaybe<usersObjRelInsertInput>;
  assignedDate?: InputMaybe<Scalars['timestamptz']['input']>;
  consultantId?: InputMaybe<Scalars['uuid']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isBackup?: InputMaybe<Scalars['Boolean']['input']>;
  originalConsultant?: InputMaybe<usersObjRelInsertInput>;
  originalConsultantId?: InputMaybe<Scalars['uuid']['input']>;
  payrollAssignmentAudits?: InputMaybe<payrollAssignmentAuditsArrRelInsertInput>;
  payrollDate?: InputMaybe<payrollDatesObjRelInsertInput>;
  payrollDateId?: InputMaybe<Scalars['uuid']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type payrollAssignmentsMaxFields = {
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
export type payrollAssignmentsMaxOrderBy = {
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
export type payrollAssignmentsMinFields = {
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
export type payrollAssignmentsMinOrderBy = {
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
export type payrollAssignmentsMutationResponse = {
  __typename?: 'payrollAssignmentsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<payrollAssignments>;
};

/** input type for inserting object relation for remote table "payroll_assignments" */
export type payrollAssignmentsObjRelInsertInput = {
  data: payrollAssignmentsInsertInput;
  /** upsert condition */
  onConflict?: InputMaybe<payrollAssignmentsOnConflict>;
};

/** on_conflict condition type for table "payroll_assignments" */
export type payrollAssignmentsOnConflict = {
  constraint: payrollAssignmentsConstraint;
  updateColumns?: Array<payrollAssignmentsUpdateColumn>;
  where?: InputMaybe<payrollAssignmentsBoolExp>;
};

/** Ordering options when selecting data from "payroll_assignments". */
export type payrollAssignmentsOrderBy = {
  assignedBy?: InputMaybe<OrderBy>;
  assignedByUser?: InputMaybe<usersOrderBy>;
  assignedConsultant?: InputMaybe<usersOrderBy>;
  assignedDate?: InputMaybe<OrderBy>;
  consultantId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  isBackup?: InputMaybe<OrderBy>;
  originalConsultant?: InputMaybe<usersOrderBy>;
  originalConsultantId?: InputMaybe<OrderBy>;
  payrollAssignmentAuditsAggregate?: InputMaybe<payrollAssignmentAuditsAggregateOrderBy>;
  payrollDate?: InputMaybe<payrollDatesOrderBy>;
  payrollDateId?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: payroll_assignments */
export type payrollAssignmentsPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "payroll_assignments" */
export type payrollAssignmentsSelectColumn =
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
  | 'updatedAt';

/** select "payrollAssignmentsAggregateBoolExpBool_andArgumentsColumns" columns of table "payroll_assignments" */
export type payrollAssignmentsSelectColumnPayrollAssignmentsAggregateBoolExpBool_andArgumentsColumns =
  /** column name */
  | 'isBackup';

/** select "payrollAssignmentsAggregateBoolExpBool_orArgumentsColumns" columns of table "payroll_assignments" */
export type payrollAssignmentsSelectColumnPayrollAssignmentsAggregateBoolExpBool_orArgumentsColumns =
  /** column name */
  | 'isBackup';

/** input type for updating data in table "payroll_assignments" */
export type payrollAssignmentsSetInput = {
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
export type payrollAssignmentsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: payrollAssignmentsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type payrollAssignmentsStreamCursorValueInput = {
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
export type payrollAssignmentsUpdateColumn =
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
  | 'updatedAt';

export type payrollAssignmentsUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<payrollAssignmentsSetInput>;
  /** filter the rows which have to be updated */
  where: payrollAssignmentsBoolExp;
};

/** columns and relationships of "payroll_cycles" */
export type payrollCycles = {
  __typename?: 'payrollCycles';
  /** An array relationship */
  adjustmentRules: Array<adjustmentRules>;
  /** An aggregate relationship */
  adjustmentRulesAggregate: adjustmentRulesAggregate;
  /** Timestamp when the cycle was created */
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  /** Detailed description of the payroll cycle */
  description?: Maybe<Scalars['String']['output']>;
  /** Unique identifier for the payroll cycle */
  id: Scalars['uuid']['output'];
  /** Name of the payroll cycle (Weekly, Biweekly, Monthly, etc.) */
  name: Scalars['payroll_cycle_type']['output'];
  /** An array relationship */
  payrolls: Array<payrolls>;
  /** An aggregate relationship */
  payrollsAggregate: payrollsAggregate;
  /** Timestamp when the cycle was last updated */
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};


/** columns and relationships of "payroll_cycles" */
export type payrollCyclesadjustmentRulesArgs = {
  distinctOn?: InputMaybe<Array<adjustmentRulesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<adjustmentRulesOrderBy>>;
  where?: InputMaybe<adjustmentRulesBoolExp>;
};


/** columns and relationships of "payroll_cycles" */
export type payrollCyclesadjustmentRulesAggregateArgs = {
  distinctOn?: InputMaybe<Array<adjustmentRulesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<adjustmentRulesOrderBy>>;
  where?: InputMaybe<adjustmentRulesBoolExp>;
};


/** columns and relationships of "payroll_cycles" */
export type payrollCyclespayrollsArgs = {
  distinctOn?: InputMaybe<Array<payrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollsOrderBy>>;
  where?: InputMaybe<payrollsBoolExp>;
};


/** columns and relationships of "payroll_cycles" */
export type payrollCyclespayrollsAggregateArgs = {
  distinctOn?: InputMaybe<Array<payrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollsOrderBy>>;
  where?: InputMaybe<payrollsBoolExp>;
};

/** aggregated selection of "payroll_cycles" */
export type payrollCyclesAggregate = {
  __typename?: 'payrollCyclesAggregate';
  aggregate?: Maybe<payrollCyclesAggregateFields>;
  nodes: Array<payrollCycles>;
};

/** aggregate fields of "payroll_cycles" */
export type payrollCyclesAggregateFields = {
  __typename?: 'payrollCyclesAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<payrollCyclesMaxFields>;
  min?: Maybe<payrollCyclesMinFields>;
};


/** aggregate fields of "payroll_cycles" */
export type payrollCyclesAggregateFieldscountArgs = {
  columns?: InputMaybe<Array<payrollCyclesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "payroll_cycles". All fields are combined with a logical 'AND'. */
export type payrollCyclesBoolExp = {
  _and?: InputMaybe<Array<payrollCyclesBoolExp>>;
  _not?: InputMaybe<payrollCyclesBoolExp>;
  _or?: InputMaybe<Array<payrollCyclesBoolExp>>;
  adjustmentRules?: InputMaybe<adjustmentRulesBoolExp>;
  adjustmentRulesAggregate?: InputMaybe<adjustmentRulesAggregateBoolExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  description?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  name?: InputMaybe<PayrollCycleTypeComparisonExp>;
  payrolls?: InputMaybe<payrollsBoolExp>;
  payrollsAggregate?: InputMaybe<payrollsAggregateBoolExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "payroll_cycles" */
export type payrollCyclesConstraint =
  /** unique or primary key constraint on columns "name" */
  | 'payroll_cycles_name_key'
  /** unique or primary key constraint on columns "id" */
  | 'payroll_cycles_pkey';

/** input type for inserting data into table "payroll_cycles" */
export type payrollCyclesInsertInput = {
  adjustmentRules?: InputMaybe<adjustmentRulesArrRelInsertInput>;
  /** Timestamp when the cycle was created */
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Detailed description of the payroll cycle */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Unique identifier for the payroll cycle */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Name of the payroll cycle (Weekly, Biweekly, Monthly, etc.) */
  name?: InputMaybe<Scalars['payroll_cycle_type']['input']>;
  payrolls?: InputMaybe<payrollsArrRelInsertInput>;
  /** Timestamp when the cycle was last updated */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type payrollCyclesMaxFields = {
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
export type payrollCyclesMinFields = {
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
export type payrollCyclesMutationResponse = {
  __typename?: 'payrollCyclesMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<payrollCycles>;
};

/** input type for inserting object relation for remote table "payroll_cycles" */
export type payrollCyclesObjRelInsertInput = {
  data: payrollCyclesInsertInput;
  /** upsert condition */
  onConflict?: InputMaybe<payrollCyclesOnConflict>;
};

/** on_conflict condition type for table "payroll_cycles" */
export type payrollCyclesOnConflict = {
  constraint: payrollCyclesConstraint;
  updateColumns?: Array<payrollCyclesUpdateColumn>;
  where?: InputMaybe<payrollCyclesBoolExp>;
};

/** Ordering options when selecting data from "payroll_cycles". */
export type payrollCyclesOrderBy = {
  adjustmentRulesAggregate?: InputMaybe<adjustmentRulesAggregateOrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  payrollsAggregate?: InputMaybe<payrollsAggregateOrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: payroll_cycles */
export type payrollCyclesPkColumnsInput = {
  /** Unique identifier for the payroll cycle */
  id: Scalars['uuid']['input'];
};

/** select columns of table "payroll_cycles" */
export type payrollCyclesSelectColumn =
  /** column name */
  | 'createdAt'
  /** column name */
  | 'description'
  /** column name */
  | 'id'
  /** column name */
  | 'name'
  /** column name */
  | 'updatedAt';

/** input type for updating data in table "payroll_cycles" */
export type payrollCyclesSetInput = {
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
export type payrollCyclesStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: payrollCyclesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type payrollCyclesStreamCursorValueInput = {
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
export type payrollCyclesUpdateColumn =
  /** column name */
  | 'createdAt'
  /** column name */
  | 'description'
  /** column name */
  | 'id'
  /** column name */
  | 'name'
  /** column name */
  | 'updatedAt';

export type payrollCyclesUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<payrollCyclesSetInput>;
  /** filter the rows which have to be updated */
  where: payrollCyclesBoolExp;
};

/** columns and relationships of "payroll_dashboard_stats" */
export type payrollDashboardStats = {
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
export type payrollDashboardStatsAggregate = {
  __typename?: 'payrollDashboardStatsAggregate';
  aggregate?: Maybe<payrollDashboardStatsAggregateFields>;
  nodes: Array<payrollDashboardStats>;
};

/** aggregate fields of "payroll_dashboard_stats" */
export type payrollDashboardStatsAggregateFields = {
  __typename?: 'payrollDashboardStatsAggregateFields';
  avg?: Maybe<payrollDashboardStatsAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<payrollDashboardStatsMaxFields>;
  min?: Maybe<payrollDashboardStatsMinFields>;
  stddev?: Maybe<payrollDashboardStatsStddevFields>;
  stddevPop?: Maybe<payrollDashboardStatsStddevPopFields>;
  stddevSamp?: Maybe<payrollDashboardStatsStddevSampFields>;
  sum?: Maybe<payrollDashboardStatsSumFields>;
  varPop?: Maybe<payrollDashboardStatsVarPopFields>;
  varSamp?: Maybe<payrollDashboardStatsVarSampFields>;
  variance?: Maybe<payrollDashboardStatsVarianceFields>;
};


/** aggregate fields of "payroll_dashboard_stats" */
export type payrollDashboardStatsAggregateFieldscountArgs = {
  columns?: InputMaybe<Array<payrollDashboardStatsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type payrollDashboardStatsAvgFields = {
  __typename?: 'payrollDashboardStatsAvgFields';
  futureDates?: Maybe<Scalars['Float']['output']>;
  pastDates?: Maybe<Scalars['Float']['output']>;
  totalDates?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "payroll_dashboard_stats". All fields are combined with a logical 'AND'. */
export type payrollDashboardStatsBoolExp = {
  _and?: InputMaybe<Array<payrollDashboardStatsBoolExp>>;
  _not?: InputMaybe<payrollDashboardStatsBoolExp>;
  _or?: InputMaybe<Array<payrollDashboardStatsBoolExp>>;
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
export type payrollDashboardStatsMaxFields = {
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
export type payrollDashboardStatsMinFields = {
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
export type payrollDashboardStatsOrderBy = {
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
export type payrollDashboardStatsSelectColumn =
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
  | 'totalDates';

/** aggregate stddev on columns */
export type payrollDashboardStatsStddevFields = {
  __typename?: 'payrollDashboardStatsStddevFields';
  futureDates?: Maybe<Scalars['Float']['output']>;
  pastDates?: Maybe<Scalars['Float']['output']>;
  totalDates?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddevPop on columns */
export type payrollDashboardStatsStddevPopFields = {
  __typename?: 'payrollDashboardStatsStddevPopFields';
  futureDates?: Maybe<Scalars['Float']['output']>;
  pastDates?: Maybe<Scalars['Float']['output']>;
  totalDates?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddevSamp on columns */
export type payrollDashboardStatsStddevSampFields = {
  __typename?: 'payrollDashboardStatsStddevSampFields';
  futureDates?: Maybe<Scalars['Float']['output']>;
  pastDates?: Maybe<Scalars['Float']['output']>;
  totalDates?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "payrollDashboardStats" */
export type payrollDashboardStatsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: payrollDashboardStatsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type payrollDashboardStatsStreamCursorValueInput = {
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
export type payrollDashboardStatsSumFields = {
  __typename?: 'payrollDashboardStatsSumFields';
  futureDates?: Maybe<Scalars['bigint']['output']>;
  pastDates?: Maybe<Scalars['bigint']['output']>;
  totalDates?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate varPop on columns */
export type payrollDashboardStatsVarPopFields = {
  __typename?: 'payrollDashboardStatsVarPopFields';
  futureDates?: Maybe<Scalars['Float']['output']>;
  pastDates?: Maybe<Scalars['Float']['output']>;
  totalDates?: Maybe<Scalars['Float']['output']>;
};

/** aggregate varSamp on columns */
export type payrollDashboardStatsVarSampFields = {
  __typename?: 'payrollDashboardStatsVarSampFields';
  futureDates?: Maybe<Scalars['Float']['output']>;
  pastDates?: Maybe<Scalars['Float']['output']>;
  totalDates?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type payrollDashboardStatsVarianceFields = {
  __typename?: 'payrollDashboardStatsVarianceFields';
  futureDates?: Maybe<Scalars['Float']['output']>;
  pastDates?: Maybe<Scalars['Float']['output']>;
  totalDates?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "payroll_date_types" */
export type payrollDateTypes = {
  __typename?: 'payrollDateTypes';
  /** An array relationship */
  adjustmentRules: Array<adjustmentRules>;
  /** An aggregate relationship */
  adjustmentRulesAggregate: adjustmentRulesAggregate;
  /** Timestamp when the date type was created */
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  /** Detailed description of how this date type works */
  description?: Maybe<Scalars['String']['output']>;
  /** Unique identifier for the payroll date type */
  id: Scalars['uuid']['output'];
  /** Name of the date type (Fixed, Last Working Day, etc.) */
  name: Scalars['payroll_date_type']['output'];
  /** An array relationship */
  payrolls: Array<payrolls>;
  /** An aggregate relationship */
  payrollsAggregate: payrollsAggregate;
  /** Timestamp when the date type was last updated */
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};


/** columns and relationships of "payroll_date_types" */
export type payrollDateTypesadjustmentRulesArgs = {
  distinctOn?: InputMaybe<Array<adjustmentRulesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<adjustmentRulesOrderBy>>;
  where?: InputMaybe<adjustmentRulesBoolExp>;
};


/** columns and relationships of "payroll_date_types" */
export type payrollDateTypesadjustmentRulesAggregateArgs = {
  distinctOn?: InputMaybe<Array<adjustmentRulesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<adjustmentRulesOrderBy>>;
  where?: InputMaybe<adjustmentRulesBoolExp>;
};


/** columns and relationships of "payroll_date_types" */
export type payrollDateTypespayrollsArgs = {
  distinctOn?: InputMaybe<Array<payrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollsOrderBy>>;
  where?: InputMaybe<payrollsBoolExp>;
};


/** columns and relationships of "payroll_date_types" */
export type payrollDateTypespayrollsAggregateArgs = {
  distinctOn?: InputMaybe<Array<payrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollsOrderBy>>;
  where?: InputMaybe<payrollsBoolExp>;
};

/** aggregated selection of "payroll_date_types" */
export type payrollDateTypesAggregate = {
  __typename?: 'payrollDateTypesAggregate';
  aggregate?: Maybe<payrollDateTypesAggregateFields>;
  nodes: Array<payrollDateTypes>;
};

/** aggregate fields of "payroll_date_types" */
export type payrollDateTypesAggregateFields = {
  __typename?: 'payrollDateTypesAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<payrollDateTypesMaxFields>;
  min?: Maybe<payrollDateTypesMinFields>;
};


/** aggregate fields of "payroll_date_types" */
export type payrollDateTypesAggregateFieldscountArgs = {
  columns?: InputMaybe<Array<payrollDateTypesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "payroll_date_types". All fields are combined with a logical 'AND'. */
export type payrollDateTypesBoolExp = {
  _and?: InputMaybe<Array<payrollDateTypesBoolExp>>;
  _not?: InputMaybe<payrollDateTypesBoolExp>;
  _or?: InputMaybe<Array<payrollDateTypesBoolExp>>;
  adjustmentRules?: InputMaybe<adjustmentRulesBoolExp>;
  adjustmentRulesAggregate?: InputMaybe<adjustmentRulesAggregateBoolExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  description?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  name?: InputMaybe<PayrollDateTypeComparisonExp>;
  payrolls?: InputMaybe<payrollsBoolExp>;
  payrollsAggregate?: InputMaybe<payrollsAggregateBoolExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "payroll_date_types" */
export type payrollDateTypesConstraint =
  /** unique or primary key constraint on columns "name" */
  | 'payroll_date_types_name_key'
  /** unique or primary key constraint on columns "id" */
  | 'payroll_date_types_pkey';

/** input type for inserting data into table "payroll_date_types" */
export type payrollDateTypesInsertInput = {
  adjustmentRules?: InputMaybe<adjustmentRulesArrRelInsertInput>;
  /** Timestamp when the date type was created */
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** Detailed description of how this date type works */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Unique identifier for the payroll date type */
  id?: InputMaybe<Scalars['uuid']['input']>;
  /** Name of the date type (Fixed, Last Working Day, etc.) */
  name?: InputMaybe<Scalars['payroll_date_type']['input']>;
  payrolls?: InputMaybe<payrollsArrRelInsertInput>;
  /** Timestamp when the date type was last updated */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type payrollDateTypesMaxFields = {
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
export type payrollDateTypesMinFields = {
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
export type payrollDateTypesMutationResponse = {
  __typename?: 'payrollDateTypesMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<payrollDateTypes>;
};

/** input type for inserting object relation for remote table "payroll_date_types" */
export type payrollDateTypesObjRelInsertInput = {
  data: payrollDateTypesInsertInput;
  /** upsert condition */
  onConflict?: InputMaybe<payrollDateTypesOnConflict>;
};

/** on_conflict condition type for table "payroll_date_types" */
export type payrollDateTypesOnConflict = {
  constraint: payrollDateTypesConstraint;
  updateColumns?: Array<payrollDateTypesUpdateColumn>;
  where?: InputMaybe<payrollDateTypesBoolExp>;
};

/** Ordering options when selecting data from "payroll_date_types". */
export type payrollDateTypesOrderBy = {
  adjustmentRulesAggregate?: InputMaybe<adjustmentRulesAggregateOrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  payrollsAggregate?: InputMaybe<payrollsAggregateOrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: payroll_date_types */
export type payrollDateTypesPkColumnsInput = {
  /** Unique identifier for the payroll date type */
  id: Scalars['uuid']['input'];
};

/** select columns of table "payroll_date_types" */
export type payrollDateTypesSelectColumn =
  /** column name */
  | 'createdAt'
  /** column name */
  | 'description'
  /** column name */
  | 'id'
  /** column name */
  | 'name'
  /** column name */
  | 'updatedAt';

/** input type for updating data in table "payroll_date_types" */
export type payrollDateTypesSetInput = {
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
export type payrollDateTypesStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: payrollDateTypesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type payrollDateTypesStreamCursorValueInput = {
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
export type payrollDateTypesUpdateColumn =
  /** column name */
  | 'createdAt'
  /** column name */
  | 'description'
  /** column name */
  | 'id'
  /** column name */
  | 'name'
  /** column name */
  | 'updatedAt';

export type payrollDateTypesUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<payrollDateTypesSetInput>;
  /** filter the rows which have to be updated */
  where: payrollDateTypesBoolExp;
};

/** columns and relationships of "payroll_dates" */
export type payrollDates = {
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
  payrollAssignment?: Maybe<payrollAssignments>;
  /** An array relationship */
  payrollAssignmentAudits: Array<payrollAssignmentAudits>;
  /** An aggregate relationship */
  payrollAssignmentAuditsAggregate: payrollAssignmentAuditsAggregate;
  /** Reference to the payroll this date belongs to */
  payrollId: Scalars['uuid']['output'];
  /** Date when payroll processing must be completed */
  processingDate: Scalars['date']['output'];
  /** An object relationship */
  relatedPayroll: payrolls;
  /** Timestamp when the date record was last updated */
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};


/** columns and relationships of "payroll_dates" */
export type payrollDatespayrollAssignmentAuditsArgs = {
  distinctOn?: InputMaybe<Array<payrollAssignmentAuditsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollAssignmentAuditsOrderBy>>;
  where?: InputMaybe<payrollAssignmentAuditsBoolExp>;
};


/** columns and relationships of "payroll_dates" */
export type payrollDatespayrollAssignmentAuditsAggregateArgs = {
  distinctOn?: InputMaybe<Array<payrollAssignmentAuditsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollAssignmentAuditsOrderBy>>;
  where?: InputMaybe<payrollAssignmentAuditsBoolExp>;
};

/** aggregated selection of "payroll_dates" */
export type payrollDatesAggregate = {
  __typename?: 'payrollDatesAggregate';
  aggregate?: Maybe<payrollDatesAggregateFields>;
  nodes: Array<payrollDates>;
};

export type payrollDatesAggregateBoolExp = {
  count?: InputMaybe<payrollDatesAggregateBoolExpCount>;
};

export type payrollDatesAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<payrollDatesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<payrollDatesBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "payroll_dates" */
export type payrollDatesAggregateFields = {
  __typename?: 'payrollDatesAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<payrollDatesMaxFields>;
  min?: Maybe<payrollDatesMinFields>;
};


/** aggregate fields of "payroll_dates" */
export type payrollDatesAggregateFieldscountArgs = {
  columns?: InputMaybe<Array<payrollDatesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "payroll_dates" */
export type payrollDatesAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<payrollDatesMaxOrderBy>;
  min?: InputMaybe<payrollDatesMinOrderBy>;
};

/** input type for inserting array relation for remote table "payroll_dates" */
export type payrollDatesArrRelInsertInput = {
  data: Array<payrollDatesInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<payrollDatesOnConflict>;
};

/** Boolean expression to filter rows from the table "payroll_dates". All fields are combined with a logical 'AND'. */
export type payrollDatesBoolExp = {
  _and?: InputMaybe<Array<payrollDatesBoolExp>>;
  _not?: InputMaybe<payrollDatesBoolExp>;
  _or?: InputMaybe<Array<payrollDatesBoolExp>>;
  adjustedEftDate?: InputMaybe<DateComparisonExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  notes?: InputMaybe<StringComparisonExp>;
  originalEftDate?: InputMaybe<DateComparisonExp>;
  payrollAssignment?: InputMaybe<payrollAssignmentsBoolExp>;
  payrollAssignmentAudits?: InputMaybe<payrollAssignmentAuditsBoolExp>;
  payrollAssignmentAuditsAggregate?: InputMaybe<payrollAssignmentAuditsAggregateBoolExp>;
  payrollId?: InputMaybe<UuidComparisonExp>;
  processingDate?: InputMaybe<DateComparisonExp>;
  relatedPayroll?: InputMaybe<payrollsBoolExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "payroll_dates" */
export type payrollDatesConstraint =
  /** unique or primary key constraint on columns "original_eft_date", "payroll_id" */
  | 'idx_unique_payroll_date'
  /** unique or primary key constraint on columns "id" */
  | 'payroll_dates_pkey';

/** input type for inserting data into table "payroll_dates" */
export type payrollDatesInsertInput = {
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
  payrollAssignment?: InputMaybe<payrollAssignmentsObjRelInsertInput>;
  payrollAssignmentAudits?: InputMaybe<payrollAssignmentAuditsArrRelInsertInput>;
  /** Reference to the payroll this date belongs to */
  payrollId?: InputMaybe<Scalars['uuid']['input']>;
  /** Date when payroll processing must be completed */
  processingDate?: InputMaybe<Scalars['date']['input']>;
  relatedPayroll?: InputMaybe<payrollsObjRelInsertInput>;
  /** Timestamp when the date record was last updated */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type payrollDatesMaxFields = {
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
export type payrollDatesMaxOrderBy = {
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
export type payrollDatesMinFields = {
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
export type payrollDatesMinOrderBy = {
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
export type payrollDatesMutationResponse = {
  __typename?: 'payrollDatesMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<payrollDates>;
};

/** input type for inserting object relation for remote table "payroll_dates" */
export type payrollDatesObjRelInsertInput = {
  data: payrollDatesInsertInput;
  /** upsert condition */
  onConflict?: InputMaybe<payrollDatesOnConflict>;
};

/** on_conflict condition type for table "payroll_dates" */
export type payrollDatesOnConflict = {
  constraint: payrollDatesConstraint;
  updateColumns?: Array<payrollDatesUpdateColumn>;
  where?: InputMaybe<payrollDatesBoolExp>;
};

/** Ordering options when selecting data from "payroll_dates". */
export type payrollDatesOrderBy = {
  adjustedEftDate?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  notes?: InputMaybe<OrderBy>;
  originalEftDate?: InputMaybe<OrderBy>;
  payrollAssignment?: InputMaybe<payrollAssignmentsOrderBy>;
  payrollAssignmentAuditsAggregate?: InputMaybe<payrollAssignmentAuditsAggregateOrderBy>;
  payrollId?: InputMaybe<OrderBy>;
  processingDate?: InputMaybe<OrderBy>;
  relatedPayroll?: InputMaybe<payrollsOrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: payroll_dates */
export type payrollDatesPkColumnsInput = {
  /** Unique identifier for the payroll date */
  id: Scalars['uuid']['input'];
};

/** select columns of table "payroll_dates" */
export type payrollDatesSelectColumn =
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
  | 'updatedAt';

/** input type for updating data in table "payroll_dates" */
export type payrollDatesSetInput = {
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
export type payrollDatesStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: payrollDatesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type payrollDatesStreamCursorValueInput = {
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
export type payrollDatesUpdateColumn =
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
  | 'updatedAt';

export type payrollDatesUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<payrollDatesSetInput>;
  /** filter the rows which have to be updated */
  where: payrollDatesBoolExp;
};

/** columns and relationships of "payroll_triggers_status" */
export type payrollTriggersStatus = {
  __typename?: 'payrollTriggersStatus';
  actionStatement?: Maybe<Scalars['String']['output']>;
  actionTiming?: Maybe<Scalars['String']['output']>;
  eventManipulation?: Maybe<Scalars['String']['output']>;
  eventObjectTable?: Maybe<Scalars['name']['output']>;
  triggerName?: Maybe<Scalars['name']['output']>;
};

/** aggregated selection of "payroll_triggers_status" */
export type payrollTriggersStatusAggregate = {
  __typename?: 'payrollTriggersStatusAggregate';
  aggregate?: Maybe<payrollTriggersStatusAggregateFields>;
  nodes: Array<payrollTriggersStatus>;
};

/** aggregate fields of "payroll_triggers_status" */
export type payrollTriggersStatusAggregateFields = {
  __typename?: 'payrollTriggersStatusAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<payrollTriggersStatusMaxFields>;
  min?: Maybe<payrollTriggersStatusMinFields>;
};


/** aggregate fields of "payroll_triggers_status" */
export type payrollTriggersStatusAggregateFieldscountArgs = {
  columns?: InputMaybe<Array<payrollTriggersStatusSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "payroll_triggers_status". All fields are combined with a logical 'AND'. */
export type payrollTriggersStatusBoolExp = {
  _and?: InputMaybe<Array<payrollTriggersStatusBoolExp>>;
  _not?: InputMaybe<payrollTriggersStatusBoolExp>;
  _or?: InputMaybe<Array<payrollTriggersStatusBoolExp>>;
  actionStatement?: InputMaybe<StringComparisonExp>;
  actionTiming?: InputMaybe<StringComparisonExp>;
  eventManipulation?: InputMaybe<StringComparisonExp>;
  eventObjectTable?: InputMaybe<NameComparisonExp>;
  triggerName?: InputMaybe<NameComparisonExp>;
};

/** aggregate max on columns */
export type payrollTriggersStatusMaxFields = {
  __typename?: 'payrollTriggersStatusMaxFields';
  actionStatement?: Maybe<Scalars['String']['output']>;
  actionTiming?: Maybe<Scalars['String']['output']>;
  eventManipulation?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type payrollTriggersStatusMinFields = {
  __typename?: 'payrollTriggersStatusMinFields';
  actionStatement?: Maybe<Scalars['String']['output']>;
  actionTiming?: Maybe<Scalars['String']['output']>;
  eventManipulation?: Maybe<Scalars['String']['output']>;
};

/** Ordering options when selecting data from "payroll_triggers_status". */
export type payrollTriggersStatusOrderBy = {
  actionStatement?: InputMaybe<OrderBy>;
  actionTiming?: InputMaybe<OrderBy>;
  eventManipulation?: InputMaybe<OrderBy>;
  eventObjectTable?: InputMaybe<OrderBy>;
  triggerName?: InputMaybe<OrderBy>;
};

/** select columns of table "payroll_triggers_status" */
export type payrollTriggersStatusSelectColumn =
  /** column name */
  | 'actionStatement'
  /** column name */
  | 'actionTiming'
  /** column name */
  | 'eventManipulation'
  /** column name */
  | 'eventObjectTable'
  /** column name */
  | 'triggerName';

/** Streaming cursor of the table "payrollTriggersStatus" */
export type payrollTriggersStatusStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: payrollTriggersStatusStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type payrollTriggersStatusStreamCursorValueInput = {
  actionStatement?: InputMaybe<Scalars['String']['input']>;
  actionTiming?: InputMaybe<Scalars['String']['input']>;
  eventManipulation?: InputMaybe<Scalars['String']['input']>;
  eventObjectTable?: InputMaybe<Scalars['name']['input']>;
  triggerName?: InputMaybe<Scalars['name']['input']>;
};

/** columns and relationships of "payroll_version_history_results" */
export type payrollVersionHistoryResults = {
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

export type payrollVersionHistoryResultsAggregate = {
  __typename?: 'payrollVersionHistoryResultsAggregate';
  aggregate?: Maybe<payrollVersionHistoryResultsAggregateFields>;
  nodes: Array<payrollVersionHistoryResults>;
};

/** aggregate fields of "payroll_version_history_results" */
export type payrollVersionHistoryResultsAggregateFields = {
  __typename?: 'payrollVersionHistoryResultsAggregateFields';
  avg?: Maybe<payrollVersionHistoryResultsAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<payrollVersionHistoryResultsMaxFields>;
  min?: Maybe<payrollVersionHistoryResultsMinFields>;
  stddev?: Maybe<payrollVersionHistoryResultsStddevFields>;
  stddevPop?: Maybe<payrollVersionHistoryResultsStddevPopFields>;
  stddevSamp?: Maybe<payrollVersionHistoryResultsStddevSampFields>;
  sum?: Maybe<payrollVersionHistoryResultsSumFields>;
  varPop?: Maybe<payrollVersionHistoryResultsVarPopFields>;
  varSamp?: Maybe<payrollVersionHistoryResultsVarSampFields>;
  variance?: Maybe<payrollVersionHistoryResultsVarianceFields>;
};


/** aggregate fields of "payroll_version_history_results" */
export type payrollVersionHistoryResultsAggregateFieldscountArgs = {
  columns?: InputMaybe<Array<payrollVersionHistoryResultsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type payrollVersionHistoryResultsAvgFields = {
  __typename?: 'payrollVersionHistoryResultsAvgFields';
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "payroll_version_history_results". All fields are combined with a logical 'AND'. */
export type payrollVersionHistoryResultsBoolExp = {
  _and?: InputMaybe<Array<payrollVersionHistoryResultsBoolExp>>;
  _not?: InputMaybe<payrollVersionHistoryResultsBoolExp>;
  _or?: InputMaybe<Array<payrollVersionHistoryResultsBoolExp>>;
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
export type payrollVersionHistoryResultsConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'payroll_version_history_results_pkey';

/** input type for incrementing numeric columns in table "payroll_version_history_results" */
export type payrollVersionHistoryResultsIncInput = {
  versionNumber?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "payroll_version_history_results" */
export type payrollVersionHistoryResultsInsertInput = {
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
export type payrollVersionHistoryResultsMaxFields = {
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
export type payrollVersionHistoryResultsMinFields = {
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
export type payrollVersionHistoryResultsMutationResponse = {
  __typename?: 'payrollVersionHistoryResultsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<payrollVersionHistoryResults>;
};

/** on_conflict condition type for table "payroll_version_history_results" */
export type payrollVersionHistoryResultsOnConflict = {
  constraint: payrollVersionHistoryResultsConstraint;
  updateColumns?: Array<payrollVersionHistoryResultsUpdateColumn>;
  where?: InputMaybe<payrollVersionHistoryResultsBoolExp>;
};

/** Ordering options when selecting data from "payroll_version_history_results". */
export type payrollVersionHistoryResultsOrderBy = {
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
export type payrollVersionHistoryResultsPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "payroll_version_history_results" */
export type payrollVersionHistoryResultsSelectColumn =
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
  | 'versionReason';

/** input type for updating data in table "payroll_version_history_results" */
export type payrollVersionHistoryResultsSetInput = {
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
export type payrollVersionHistoryResultsStddevFields = {
  __typename?: 'payrollVersionHistoryResultsStddevFields';
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddevPop on columns */
export type payrollVersionHistoryResultsStddevPopFields = {
  __typename?: 'payrollVersionHistoryResultsStddevPopFields';
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddevSamp on columns */
export type payrollVersionHistoryResultsStddevSampFields = {
  __typename?: 'payrollVersionHistoryResultsStddevSampFields';
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "payrollVersionHistoryResults" */
export type payrollVersionHistoryResultsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: payrollVersionHistoryResultsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type payrollVersionHistoryResultsStreamCursorValueInput = {
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
export type payrollVersionHistoryResultsSumFields = {
  __typename?: 'payrollVersionHistoryResultsSumFields';
  versionNumber?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "payroll_version_history_results" */
export type payrollVersionHistoryResultsUpdateColumn =
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
  | 'versionReason';

export type payrollVersionHistoryResultsUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<payrollVersionHistoryResultsIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<payrollVersionHistoryResultsSetInput>;
  /** filter the rows which have to be updated */
  where: payrollVersionHistoryResultsBoolExp;
};

/** aggregate varPop on columns */
export type payrollVersionHistoryResultsVarPopFields = {
  __typename?: 'payrollVersionHistoryResultsVarPopFields';
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** aggregate varSamp on columns */
export type payrollVersionHistoryResultsVarSampFields = {
  __typename?: 'payrollVersionHistoryResultsVarSampFields';
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type payrollVersionHistoryResultsVarianceFields = {
  __typename?: 'payrollVersionHistoryResultsVarianceFields';
  versionNumber?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "payroll_version_results" */
export type payrollVersionResults = {
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

export type payrollVersionResultsAggregate = {
  __typename?: 'payrollVersionResultsAggregate';
  aggregate?: Maybe<payrollVersionResultsAggregateFields>;
  nodes: Array<payrollVersionResults>;
};

/** aggregate fields of "payroll_version_results" */
export type payrollVersionResultsAggregateFields = {
  __typename?: 'payrollVersionResultsAggregateFields';
  avg?: Maybe<payrollVersionResultsAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<payrollVersionResultsMaxFields>;
  min?: Maybe<payrollVersionResultsMinFields>;
  stddev?: Maybe<payrollVersionResultsStddevFields>;
  stddevPop?: Maybe<payrollVersionResultsStddevPopFields>;
  stddevSamp?: Maybe<payrollVersionResultsStddevSampFields>;
  sum?: Maybe<payrollVersionResultsSumFields>;
  varPop?: Maybe<payrollVersionResultsVarPopFields>;
  varSamp?: Maybe<payrollVersionResultsVarSampFields>;
  variance?: Maybe<payrollVersionResultsVarianceFields>;
};


/** aggregate fields of "payroll_version_results" */
export type payrollVersionResultsAggregateFieldscountArgs = {
  columns?: InputMaybe<Array<payrollVersionResultsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type payrollVersionResultsAvgFields = {
  __typename?: 'payrollVersionResultsAvgFields';
  datesDeleted?: Maybe<Scalars['Float']['output']>;
  newVersionNumber?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "payroll_version_results". All fields are combined with a logical 'AND'. */
export type payrollVersionResultsBoolExp = {
  _and?: InputMaybe<Array<payrollVersionResultsBoolExp>>;
  _not?: InputMaybe<payrollVersionResultsBoolExp>;
  _or?: InputMaybe<Array<payrollVersionResultsBoolExp>>;
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
export type payrollVersionResultsConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'payroll_version_results_pkey';

/** input type for incrementing numeric columns in table "payroll_version_results" */
export type payrollVersionResultsIncInput = {
  datesDeleted?: InputMaybe<Scalars['Int']['input']>;
  newVersionNumber?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "payroll_version_results" */
export type payrollVersionResultsInsertInput = {
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
export type payrollVersionResultsMaxFields = {
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
export type payrollVersionResultsMinFields = {
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
export type payrollVersionResultsMutationResponse = {
  __typename?: 'payrollVersionResultsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<payrollVersionResults>;
};

/** on_conflict condition type for table "payroll_version_results" */
export type payrollVersionResultsOnConflict = {
  constraint: payrollVersionResultsConstraint;
  updateColumns?: Array<payrollVersionResultsUpdateColumn>;
  where?: InputMaybe<payrollVersionResultsBoolExp>;
};

/** Ordering options when selecting data from "payroll_version_results". */
export type payrollVersionResultsOrderBy = {
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
export type payrollVersionResultsPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "payroll_version_results" */
export type payrollVersionResultsSelectColumn =
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
  | 'oldPayrollId';

/** input type for updating data in table "payroll_version_results" */
export type payrollVersionResultsSetInput = {
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
export type payrollVersionResultsStddevFields = {
  __typename?: 'payrollVersionResultsStddevFields';
  datesDeleted?: Maybe<Scalars['Float']['output']>;
  newVersionNumber?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddevPop on columns */
export type payrollVersionResultsStddevPopFields = {
  __typename?: 'payrollVersionResultsStddevPopFields';
  datesDeleted?: Maybe<Scalars['Float']['output']>;
  newVersionNumber?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddevSamp on columns */
export type payrollVersionResultsStddevSampFields = {
  __typename?: 'payrollVersionResultsStddevSampFields';
  datesDeleted?: Maybe<Scalars['Float']['output']>;
  newVersionNumber?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "payrollVersionResults" */
export type payrollVersionResultsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: payrollVersionResultsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type payrollVersionResultsStreamCursorValueInput = {
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
export type payrollVersionResultsSumFields = {
  __typename?: 'payrollVersionResultsSumFields';
  datesDeleted?: Maybe<Scalars['Int']['output']>;
  newVersionNumber?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "payroll_version_results" */
export type payrollVersionResultsUpdateColumn =
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
  | 'oldPayrollId';

export type payrollVersionResultsUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<payrollVersionResultsIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<payrollVersionResultsSetInput>;
  /** filter the rows which have to be updated */
  where: payrollVersionResultsBoolExp;
};

/** aggregate varPop on columns */
export type payrollVersionResultsVarPopFields = {
  __typename?: 'payrollVersionResultsVarPopFields';
  datesDeleted?: Maybe<Scalars['Float']['output']>;
  newVersionNumber?: Maybe<Scalars['Float']['output']>;
};

/** aggregate varSamp on columns */
export type payrollVersionResultsVarSampFields = {
  __typename?: 'payrollVersionResultsVarSampFields';
  datesDeleted?: Maybe<Scalars['Float']['output']>;
  newVersionNumber?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type payrollVersionResultsVarianceFields = {
  __typename?: 'payrollVersionResultsVarianceFields';
  datesDeleted?: Maybe<Scalars['Float']['output']>;
  newVersionNumber?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "payrolls" */
export type payrolls = {
  __typename?: 'payrolls';
  /** An object relationship */
  backupConsultant?: Maybe<users>;
  /** Backup consultant for this payroll */
  backupConsultantUserId?: Maybe<Scalars['uuid']['output']>;
  /** An array relationship */
  billingItems: Array<billingItems>;
  /** An aggregate relationship */
  billingItemsAggregate: billingItemsAggregate;
  /** An array relationship */
  childPayrolls: Array<payrolls>;
  /** An aggregate relationship */
  childPayrollsAggregate: payrollsAggregate;
  /** An object relationship */
  client: clients;
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
  manager?: Maybe<users>;
  /** Manager overseeing this payroll */
  managerUserId?: Maybe<Scalars['uuid']['output']>;
  /** Name of the payroll */
  name: Scalars['String']['output'];
  /** An object relationship */
  parentPayroll?: Maybe<payrolls>;
  parentPayrollId?: Maybe<Scalars['uuid']['output']>;
  /** An object relationship */
  payrollCycle: payrollCycles;
  /** An object relationship */
  payrollDateType: payrollDateTypes;
  /** An array relationship */
  payrollDates: Array<payrollDates>;
  /** An aggregate relationship */
  payrollDatesAggregate: payrollDatesAggregate;
  /** External payroll system used for this client */
  payrollSystem?: Maybe<Scalars['String']['output']>;
  /** An object relationship */
  primaryConsultant?: Maybe<users>;
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
export type payrollsbillingItemsArgs = {
  distinctOn?: InputMaybe<Array<billingItemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<billingItemsOrderBy>>;
  where?: InputMaybe<billingItemsBoolExp>;
};


/** columns and relationships of "payrolls" */
export type payrollsbillingItemsAggregateArgs = {
  distinctOn?: InputMaybe<Array<billingItemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<billingItemsOrderBy>>;
  where?: InputMaybe<billingItemsBoolExp>;
};


/** columns and relationships of "payrolls" */
export type payrollschildPayrollsArgs = {
  distinctOn?: InputMaybe<Array<payrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollsOrderBy>>;
  where?: InputMaybe<payrollsBoolExp>;
};


/** columns and relationships of "payrolls" */
export type payrollschildPayrollsAggregateArgs = {
  distinctOn?: InputMaybe<Array<payrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollsOrderBy>>;
  where?: InputMaybe<payrollsBoolExp>;
};


/** columns and relationships of "payrolls" */
export type payrollspayrollDatesArgs = {
  distinctOn?: InputMaybe<Array<payrollDatesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollDatesOrderBy>>;
  where?: InputMaybe<payrollDatesBoolExp>;
};


/** columns and relationships of "payrolls" */
export type payrollspayrollDatesAggregateArgs = {
  distinctOn?: InputMaybe<Array<payrollDatesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollDatesOrderBy>>;
  where?: InputMaybe<payrollDatesBoolExp>;
};

/** aggregated selection of "payrolls" */
export type payrollsAggregate = {
  __typename?: 'payrollsAggregate';
  aggregate?: Maybe<payrollsAggregateFields>;
  nodes: Array<payrolls>;
};

export type payrollsAggregateBoolExp = {
  count?: InputMaybe<payrollsAggregateBoolExpCount>;
};

export type payrollsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<payrollsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<payrollsBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "payrolls" */
export type payrollsAggregateFields = {
  __typename?: 'payrollsAggregateFields';
  avg?: Maybe<payrollsAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<payrollsMaxFields>;
  min?: Maybe<payrollsMinFields>;
  stddev?: Maybe<payrollsStddevFields>;
  stddevPop?: Maybe<payrollsStddevPopFields>;
  stddevSamp?: Maybe<payrollsStddevSampFields>;
  sum?: Maybe<payrollsSumFields>;
  varPop?: Maybe<payrollsVarPopFields>;
  varSamp?: Maybe<payrollsVarSampFields>;
  variance?: Maybe<payrollsVarianceFields>;
};


/** aggregate fields of "payrolls" */
export type payrollsAggregateFieldscountArgs = {
  columns?: InputMaybe<Array<payrollsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "payrolls" */
export type payrollsAggregateOrderBy = {
  avg?: InputMaybe<payrollsAvgOrderBy>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<payrollsMaxOrderBy>;
  min?: InputMaybe<payrollsMinOrderBy>;
  stddev?: InputMaybe<payrollsStddevOrderBy>;
  stddevPop?: InputMaybe<payrollsStddevPopOrderBy>;
  stddevSamp?: InputMaybe<payrollsStddevSampOrderBy>;
  sum?: InputMaybe<payrollsSumOrderBy>;
  varPop?: InputMaybe<payrollsVarPopOrderBy>;
  varSamp?: InputMaybe<payrollsVarSampOrderBy>;
  variance?: InputMaybe<payrollsVarianceOrderBy>;
};

/** input type for inserting array relation for remote table "payrolls" */
export type payrollsArrRelInsertInput = {
  data: Array<payrollsInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<payrollsOnConflict>;
};

/** aggregate avg on columns */
export type payrollsAvgFields = {
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
export type payrollsAvgOrderBy = {
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
export type payrollsBoolExp = {
  _and?: InputMaybe<Array<payrollsBoolExp>>;
  _not?: InputMaybe<payrollsBoolExp>;
  _or?: InputMaybe<Array<payrollsBoolExp>>;
  backupConsultant?: InputMaybe<usersBoolExp>;
  backupConsultantUserId?: InputMaybe<UuidComparisonExp>;
  billingItems?: InputMaybe<billingItemsBoolExp>;
  billingItemsAggregate?: InputMaybe<billingItemsAggregateBoolExp>;
  childPayrolls?: InputMaybe<payrollsBoolExp>;
  childPayrollsAggregate?: InputMaybe<payrollsAggregateBoolExp>;
  client?: InputMaybe<clientsBoolExp>;
  clientId?: InputMaybe<UuidComparisonExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  createdByUserId?: InputMaybe<UuidComparisonExp>;
  cycleId?: InputMaybe<UuidComparisonExp>;
  dateTypeId?: InputMaybe<UuidComparisonExp>;
  dateValue?: InputMaybe<IntComparisonExp>;
  employeeCount?: InputMaybe<IntComparisonExp>;
  goLiveDate?: InputMaybe<DateComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  manager?: InputMaybe<usersBoolExp>;
  managerUserId?: InputMaybe<UuidComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  parentPayroll?: InputMaybe<payrollsBoolExp>;
  parentPayrollId?: InputMaybe<UuidComparisonExp>;
  payrollCycle?: InputMaybe<payrollCyclesBoolExp>;
  payrollDateType?: InputMaybe<payrollDateTypesBoolExp>;
  payrollDates?: InputMaybe<payrollDatesBoolExp>;
  payrollDatesAggregate?: InputMaybe<payrollDatesAggregateBoolExp>;
  payrollSystem?: InputMaybe<StringComparisonExp>;
  primaryConsultant?: InputMaybe<usersBoolExp>;
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
export type payrollsConstraint =
  /** unique or primary key constraint on columns  */
  | 'only_one_current_version_per_family'
  /** unique or primary key constraint on columns "id" */
  | 'payrolls_pkey';

/** input type for incrementing numeric columns in table "payrolls" */
export type payrollsIncInput = {
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
export type payrollsInsertInput = {
  backupConsultant?: InputMaybe<usersObjRelInsertInput>;
  /** Backup consultant for this payroll */
  backupConsultantUserId?: InputMaybe<Scalars['uuid']['input']>;
  billingItems?: InputMaybe<billingItemsArrRelInsertInput>;
  childPayrolls?: InputMaybe<payrollsArrRelInsertInput>;
  client?: InputMaybe<clientsObjRelInsertInput>;
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
  manager?: InputMaybe<usersObjRelInsertInput>;
  /** Manager overseeing this payroll */
  managerUserId?: InputMaybe<Scalars['uuid']['input']>;
  /** Name of the payroll */
  name?: InputMaybe<Scalars['String']['input']>;
  parentPayroll?: InputMaybe<payrollsObjRelInsertInput>;
  parentPayrollId?: InputMaybe<Scalars['uuid']['input']>;
  payrollCycle?: InputMaybe<payrollCyclesObjRelInsertInput>;
  payrollDateType?: InputMaybe<payrollDateTypesObjRelInsertInput>;
  payrollDates?: InputMaybe<payrollDatesArrRelInsertInput>;
  /** External payroll system used for this client */
  payrollSystem?: InputMaybe<Scalars['String']['input']>;
  primaryConsultant?: InputMaybe<usersObjRelInsertInput>;
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
export type payrollsMaxFields = {
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
export type payrollsMaxOrderBy = {
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
export type payrollsMinFields = {
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
export type payrollsMinOrderBy = {
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
export type payrollsMutationResponse = {
  __typename?: 'payrollsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<payrolls>;
};

/** input type for inserting object relation for remote table "payrolls" */
export type payrollsObjRelInsertInput = {
  data: payrollsInsertInput;
  /** upsert condition */
  onConflict?: InputMaybe<payrollsOnConflict>;
};

/** on_conflict condition type for table "payrolls" */
export type payrollsOnConflict = {
  constraint: payrollsConstraint;
  updateColumns?: Array<payrollsUpdateColumn>;
  where?: InputMaybe<payrollsBoolExp>;
};

/** Ordering options when selecting data from "payrolls". */
export type payrollsOrderBy = {
  backupConsultant?: InputMaybe<usersOrderBy>;
  backupConsultantUserId?: InputMaybe<OrderBy>;
  billingItemsAggregate?: InputMaybe<billingItemsAggregateOrderBy>;
  childPayrollsAggregate?: InputMaybe<payrollsAggregateOrderBy>;
  client?: InputMaybe<clientsOrderBy>;
  clientId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  createdByUserId?: InputMaybe<OrderBy>;
  cycleId?: InputMaybe<OrderBy>;
  dateTypeId?: InputMaybe<OrderBy>;
  dateValue?: InputMaybe<OrderBy>;
  employeeCount?: InputMaybe<OrderBy>;
  goLiveDate?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  manager?: InputMaybe<usersOrderBy>;
  managerUserId?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  parentPayroll?: InputMaybe<payrollsOrderBy>;
  parentPayrollId?: InputMaybe<OrderBy>;
  payrollCycle?: InputMaybe<payrollCyclesOrderBy>;
  payrollDateType?: InputMaybe<payrollDateTypesOrderBy>;
  payrollDatesAggregate?: InputMaybe<payrollDatesAggregateOrderBy>;
  payrollSystem?: InputMaybe<OrderBy>;
  primaryConsultant?: InputMaybe<usersOrderBy>;
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
export type payrollsPkColumnsInput = {
  /** Unique identifier for the payroll */
  id: Scalars['uuid']['input'];
};

/** select columns of table "payrolls" */
export type payrollsSelectColumn =
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
  | 'versionReason';

/** input type for updating data in table "payrolls" */
export type payrollsSetInput = {
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
export type payrollsStddevFields = {
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
export type payrollsStddevOrderBy = {
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
export type payrollsStddevPopFields = {
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
export type payrollsStddevPopOrderBy = {
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
export type payrollsStddevSampFields = {
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
export type payrollsStddevSampOrderBy = {
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
export type payrollsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: payrollsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type payrollsStreamCursorValueInput = {
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
export type payrollsSumFields = {
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
export type payrollsSumOrderBy = {
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
export type payrollsUpdateColumn =
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
  | 'versionReason';

export type payrollsUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<payrollsIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<payrollsSetInput>;
  /** filter the rows which have to be updated */
  where: payrollsBoolExp;
};

/** aggregate varPop on columns */
export type payrollsVarPopFields = {
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
export type payrollsVarPopOrderBy = {
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
export type payrollsVarSampFields = {
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
export type payrollsVarSampOrderBy = {
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
export type payrollsVarianceFields = {
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
export type payrollsVarianceOrderBy = {
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
export type permissionAuditLogs = {
  __typename?: 'permissionAuditLogs';
  action: Scalars['String']['output'];
  createdAt: Scalars['timestamptz']['output'];
  id: Scalars['uuid']['output'];
  newValue?: Maybe<Scalars['jsonb']['output']>;
  operation: Scalars['String']['output'];
  /** An object relationship */
  performedByUser?: Maybe<users>;
  previousValue?: Maybe<Scalars['jsonb']['output']>;
  reason?: Maybe<Scalars['String']['output']>;
  resource: Scalars['String']['output'];
  targetRole?: Maybe<Scalars['String']['output']>;
  /** An object relationship */
  targetUser?: Maybe<users>;
  targetUserId?: Maybe<Scalars['uuid']['output']>;
  timestamp: Scalars['timestamptz']['output'];
  userId?: Maybe<Scalars['uuid']['output']>;
};


/** Audit log for permission changes and access attempts */
export type permissionAuditLogsnewValueArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** Audit log for permission changes and access attempts */
export type permissionAuditLogspreviousValueArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "permission_audit_log" */
export type permissionAuditLogsAggregate = {
  __typename?: 'permissionAuditLogsAggregate';
  aggregate?: Maybe<permissionAuditLogsAggregateFields>;
  nodes: Array<permissionAuditLogs>;
};

export type permissionAuditLogsAggregateBoolExp = {
  count?: InputMaybe<permissionAuditLogsAggregateBoolExpCount>;
};

export type permissionAuditLogsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<permissionAuditLogsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<permissionAuditLogsBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "permission_audit_log" */
export type permissionAuditLogsAggregateFields = {
  __typename?: 'permissionAuditLogsAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<permissionAuditLogsMaxFields>;
  min?: Maybe<permissionAuditLogsMinFields>;
};


/** aggregate fields of "permission_audit_log" */
export type permissionAuditLogsAggregateFieldscountArgs = {
  columns?: InputMaybe<Array<permissionAuditLogsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "permission_audit_log" */
export type permissionAuditLogsAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<permissionAuditLogsMaxOrderBy>;
  min?: InputMaybe<permissionAuditLogsMinOrderBy>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type permissionAuditLogsAppendInput = {
  newValue?: InputMaybe<Scalars['jsonb']['input']>;
  previousValue?: InputMaybe<Scalars['jsonb']['input']>;
};

/** input type for inserting array relation for remote table "permission_audit_log" */
export type permissionAuditLogsArrRelInsertInput = {
  data: Array<permissionAuditLogsInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<permissionAuditLogsOnConflict>;
};

/** Boolean expression to filter rows from the table "permission_audit_log". All fields are combined with a logical 'AND'. */
export type permissionAuditLogsBoolExp = {
  _and?: InputMaybe<Array<permissionAuditLogsBoolExp>>;
  _not?: InputMaybe<permissionAuditLogsBoolExp>;
  _or?: InputMaybe<Array<permissionAuditLogsBoolExp>>;
  action?: InputMaybe<StringComparisonExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  newValue?: InputMaybe<JsonbComparisonExp>;
  operation?: InputMaybe<StringComparisonExp>;
  performedByUser?: InputMaybe<usersBoolExp>;
  previousValue?: InputMaybe<JsonbComparisonExp>;
  reason?: InputMaybe<StringComparisonExp>;
  resource?: InputMaybe<StringComparisonExp>;
  targetRole?: InputMaybe<StringComparisonExp>;
  targetUser?: InputMaybe<usersBoolExp>;
  targetUserId?: InputMaybe<UuidComparisonExp>;
  timestamp?: InputMaybe<TimestamptzComparisonExp>;
  userId?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "permission_audit_log" */
export type permissionAuditLogsConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'permission_audit_log_pkey';

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type permissionAuditLogsDeleteAtPathInput = {
  newValue?: InputMaybe<Array<Scalars['String']['input']>>;
  previousValue?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type permissionAuditLogsDeleteElemInput = {
  newValue?: InputMaybe<Scalars['Int']['input']>;
  previousValue?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type permissionAuditLogsDeleteKeyInput = {
  newValue?: InputMaybe<Scalars['String']['input']>;
  previousValue?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "permission_audit_log" */
export type permissionAuditLogsInsertInput = {
  action?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  newValue?: InputMaybe<Scalars['jsonb']['input']>;
  operation?: InputMaybe<Scalars['String']['input']>;
  performedByUser?: InputMaybe<usersObjRelInsertInput>;
  previousValue?: InputMaybe<Scalars['jsonb']['input']>;
  reason?: InputMaybe<Scalars['String']['input']>;
  resource?: InputMaybe<Scalars['String']['input']>;
  targetRole?: InputMaybe<Scalars['String']['input']>;
  targetUser?: InputMaybe<usersObjRelInsertInput>;
  targetUserId?: InputMaybe<Scalars['uuid']['input']>;
  timestamp?: InputMaybe<Scalars['timestamptz']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type permissionAuditLogsMaxFields = {
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
export type permissionAuditLogsMaxOrderBy = {
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
export type permissionAuditLogsMinFields = {
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
export type permissionAuditLogsMinOrderBy = {
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
export type permissionAuditLogsMutationResponse = {
  __typename?: 'permissionAuditLogsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<permissionAuditLogs>;
};

/** on_conflict condition type for table "permission_audit_log" */
export type permissionAuditLogsOnConflict = {
  constraint: permissionAuditLogsConstraint;
  updateColumns?: Array<permissionAuditLogsUpdateColumn>;
  where?: InputMaybe<permissionAuditLogsBoolExp>;
};

/** Ordering options when selecting data from "permission_audit_log". */
export type permissionAuditLogsOrderBy = {
  action?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  newValue?: InputMaybe<OrderBy>;
  operation?: InputMaybe<OrderBy>;
  performedByUser?: InputMaybe<usersOrderBy>;
  previousValue?: InputMaybe<OrderBy>;
  reason?: InputMaybe<OrderBy>;
  resource?: InputMaybe<OrderBy>;
  targetRole?: InputMaybe<OrderBy>;
  targetUser?: InputMaybe<usersOrderBy>;
  targetUserId?: InputMaybe<OrderBy>;
  timestamp?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: permission_audit_log */
export type permissionAuditLogsPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type permissionAuditLogsPrependInput = {
  newValue?: InputMaybe<Scalars['jsonb']['input']>;
  previousValue?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "permission_audit_log" */
export type permissionAuditLogsSelectColumn =
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
  | 'userId';

/** input type for updating data in table "permission_audit_log" */
export type permissionAuditLogsSetInput = {
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
export type permissionAuditLogsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: permissionAuditLogsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type permissionAuditLogsStreamCursorValueInput = {
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
export type permissionAuditLogsUpdateColumn =
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
  | 'userId';

export type permissionAuditLogsUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<permissionAuditLogsAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _deleteAtPath?: InputMaybe<permissionAuditLogsDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _deleteElem?: InputMaybe<permissionAuditLogsDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _deleteKey?: InputMaybe<permissionAuditLogsDeleteKeyInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<permissionAuditLogsPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<permissionAuditLogsSetInput>;
  /** filter the rows which have to be updated */
  where: permissionAuditLogsBoolExp;
};

/** columns and relationships of "audit.permission_changes" */
export type permissionChanges = {
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
export type permissionChangesmetadataArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "audit.permission_changes" */
export type permissionChangesnewPermissionsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "audit.permission_changes" */
export type permissionChangesoldPermissionsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "audit.permission_changes" */
export type permissionChangesAggregate = {
  __typename?: 'permissionChangesAggregate';
  aggregate?: Maybe<permissionChangesAggregateFields>;
  nodes: Array<permissionChanges>;
};

/** aggregate fields of "audit.permission_changes" */
export type permissionChangesAggregateFields = {
  __typename?: 'permissionChangesAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<permissionChangesMaxFields>;
  min?: Maybe<permissionChangesMinFields>;
};


/** aggregate fields of "audit.permission_changes" */
export type permissionChangesAggregateFieldscountArgs = {
  columns?: InputMaybe<Array<permissionChangesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type permissionChangesAppendInput = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  newPermissions?: InputMaybe<Scalars['jsonb']['input']>;
  oldPermissions?: InputMaybe<Scalars['jsonb']['input']>;
};

/** Boolean expression to filter rows from the table "audit.permission_changes". All fields are combined with a logical 'AND'. */
export type permissionChangesBoolExp = {
  _and?: InputMaybe<Array<permissionChangesBoolExp>>;
  _not?: InputMaybe<permissionChangesBoolExp>;
  _or?: InputMaybe<Array<permissionChangesBoolExp>>;
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
export type permissionChangesConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'permission_changes_pkey';

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type permissionChangesDeleteAtPathInput = {
  metadata?: InputMaybe<Array<Scalars['String']['input']>>;
  newPermissions?: InputMaybe<Array<Scalars['String']['input']>>;
  oldPermissions?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type permissionChangesDeleteElemInput = {
  metadata?: InputMaybe<Scalars['Int']['input']>;
  newPermissions?: InputMaybe<Scalars['Int']['input']>;
  oldPermissions?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type permissionChangesDeleteKeyInput = {
  metadata?: InputMaybe<Scalars['String']['input']>;
  newPermissions?: InputMaybe<Scalars['String']['input']>;
  oldPermissions?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "audit.permission_changes" */
export type permissionChangesInsertInput = {
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
export type permissionChangesMaxFields = {
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
export type permissionChangesMinFields = {
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
export type permissionChangesMutationResponse = {
  __typename?: 'permissionChangesMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<permissionChanges>;
};

/** on_conflict condition type for table "audit.permission_changes" */
export type permissionChangesOnConflict = {
  constraint: permissionChangesConstraint;
  updateColumns?: Array<permissionChangesUpdateColumn>;
  where?: InputMaybe<permissionChangesBoolExp>;
};

/** Ordering options when selecting data from "audit.permission_changes". */
export type permissionChangesOrderBy = {
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
export type permissionChangesPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type permissionChangesPrependInput = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  newPermissions?: InputMaybe<Scalars['jsonb']['input']>;
  oldPermissions?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "audit.permission_changes" */
export type permissionChangesSelectColumn =
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
  | 'targetUserId';

/** input type for updating data in table "audit.permission_changes" */
export type permissionChangesSetInput = {
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
export type permissionChangesStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: permissionChangesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type permissionChangesStreamCursorValueInput = {
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
export type permissionChangesUpdateColumn =
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
  | 'targetUserId';

export type permissionChangesUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<permissionChangesAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _deleteAtPath?: InputMaybe<permissionChangesDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _deleteElem?: InputMaybe<permissionChangesDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _deleteKey?: InputMaybe<permissionChangesDeleteKeyInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<permissionChangesPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<permissionChangesSetInput>;
  /** filter the rows which have to be updated */
  where: permissionChangesBoolExp;
};

/** User-specific and role-specific permission overrides */
export type permissionOverrides = {
  __typename?: 'permissionOverrides';
  /** JSON conditions for conditional permissions */
  conditions?: Maybe<Scalars['jsonb']['output']>;
  createdAt: Scalars['timestamptz']['output'];
  createdBy?: Maybe<Scalars['uuid']['output']>;
  /** An object relationship */
  createdByUser?: Maybe<users>;
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
  targetUser?: Maybe<users>;
  updatedAt: Scalars['timestamptz']['output'];
  /** User ID for user-specific overrides (mutually exclusive with role) */
  userId?: Maybe<Scalars['uuid']['output']>;
};


/** User-specific and role-specific permission overrides */
export type permissionOverridesconditionsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "permission_overrides" */
export type permissionOverridesAggregate = {
  __typename?: 'permissionOverridesAggregate';
  aggregate?: Maybe<permissionOverridesAggregateFields>;
  nodes: Array<permissionOverrides>;
};

export type permissionOverridesAggregateBoolExp = {
  bool_and?: InputMaybe<permissionOverridesAggregateBoolExpBool_and>;
  bool_or?: InputMaybe<permissionOverridesAggregateBoolExpBool_or>;
  count?: InputMaybe<permissionOverridesAggregateBoolExpCount>;
};

export type permissionOverridesAggregateBoolExpBool_and = {
  arguments: permissionOverridesSelectColumnPermissionOverridesAggregateBoolExpBool_andArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<permissionOverridesBoolExp>;
  predicate: BooleanComparisonExp;
};

export type permissionOverridesAggregateBoolExpBool_or = {
  arguments: permissionOverridesSelectColumnPermissionOverridesAggregateBoolExpBool_orArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<permissionOverridesBoolExp>;
  predicate: BooleanComparisonExp;
};

export type permissionOverridesAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<permissionOverridesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<permissionOverridesBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "permission_overrides" */
export type permissionOverridesAggregateFields = {
  __typename?: 'permissionOverridesAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<permissionOverridesMaxFields>;
  min?: Maybe<permissionOverridesMinFields>;
};


/** aggregate fields of "permission_overrides" */
export type permissionOverridesAggregateFieldscountArgs = {
  columns?: InputMaybe<Array<permissionOverridesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "permission_overrides" */
export type permissionOverridesAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<permissionOverridesMaxOrderBy>;
  min?: InputMaybe<permissionOverridesMinOrderBy>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type permissionOverridesAppendInput = {
  /** JSON conditions for conditional permissions */
  conditions?: InputMaybe<Scalars['jsonb']['input']>;
};

/** input type for inserting array relation for remote table "permission_overrides" */
export type permissionOverridesArrRelInsertInput = {
  data: Array<permissionOverridesInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<permissionOverridesOnConflict>;
};

/** Boolean expression to filter rows from the table "permission_overrides". All fields are combined with a logical 'AND'. */
export type permissionOverridesBoolExp = {
  _and?: InputMaybe<Array<permissionOverridesBoolExp>>;
  _not?: InputMaybe<permissionOverridesBoolExp>;
  _or?: InputMaybe<Array<permissionOverridesBoolExp>>;
  conditions?: InputMaybe<JsonbComparisonExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  createdBy?: InputMaybe<UuidComparisonExp>;
  createdByUser?: InputMaybe<usersBoolExp>;
  expiresAt?: InputMaybe<TimestamptzComparisonExp>;
  granted?: InputMaybe<BooleanComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  operation?: InputMaybe<StringComparisonExp>;
  reason?: InputMaybe<StringComparisonExp>;
  resource?: InputMaybe<StringComparisonExp>;
  role?: InputMaybe<StringComparisonExp>;
  targetUser?: InputMaybe<usersBoolExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
  userId?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "permission_overrides" */
export type permissionOverridesConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'permission_overrides_pkey';

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type permissionOverridesDeleteAtPathInput = {
  /** JSON conditions for conditional permissions */
  conditions?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type permissionOverridesDeleteElemInput = {
  /** JSON conditions for conditional permissions */
  conditions?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type permissionOverridesDeleteKeyInput = {
  /** JSON conditions for conditional permissions */
  conditions?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "permission_overrides" */
export type permissionOverridesInsertInput = {
  /** JSON conditions for conditional permissions */
  conditions?: InputMaybe<Scalars['jsonb']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  createdBy?: InputMaybe<Scalars['uuid']['input']>;
  createdByUser?: InputMaybe<usersObjRelInsertInput>;
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
  targetUser?: InputMaybe<usersObjRelInsertInput>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  /** User ID for user-specific overrides (mutually exclusive with role) */
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type permissionOverridesMaxFields = {
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
export type permissionOverridesMaxOrderBy = {
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
export type permissionOverridesMinFields = {
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
export type permissionOverridesMinOrderBy = {
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
export type permissionOverridesMutationResponse = {
  __typename?: 'permissionOverridesMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<permissionOverrides>;
};

/** on_conflict condition type for table "permission_overrides" */
export type permissionOverridesOnConflict = {
  constraint: permissionOverridesConstraint;
  updateColumns?: Array<permissionOverridesUpdateColumn>;
  where?: InputMaybe<permissionOverridesBoolExp>;
};

/** Ordering options when selecting data from "permission_overrides". */
export type permissionOverridesOrderBy = {
  conditions?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  createdBy?: InputMaybe<OrderBy>;
  createdByUser?: InputMaybe<usersOrderBy>;
  expiresAt?: InputMaybe<OrderBy>;
  granted?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  operation?: InputMaybe<OrderBy>;
  reason?: InputMaybe<OrderBy>;
  resource?: InputMaybe<OrderBy>;
  role?: InputMaybe<OrderBy>;
  targetUser?: InputMaybe<usersOrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: permission_overrides */
export type permissionOverridesPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type permissionOverridesPrependInput = {
  /** JSON conditions for conditional permissions */
  conditions?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "permission_overrides" */
export type permissionOverridesSelectColumn =
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
  | 'userId';

/** select "permissionOverridesAggregateBoolExpBool_andArgumentsColumns" columns of table "permission_overrides" */
export type permissionOverridesSelectColumnPermissionOverridesAggregateBoolExpBool_andArgumentsColumns =
  /** column name */
  | 'granted';

/** select "permissionOverridesAggregateBoolExpBool_orArgumentsColumns" columns of table "permission_overrides" */
export type permissionOverridesSelectColumnPermissionOverridesAggregateBoolExpBool_orArgumentsColumns =
  /** column name */
  | 'granted';

/** input type for updating data in table "permission_overrides" */
export type permissionOverridesSetInput = {
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
export type permissionOverridesStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: permissionOverridesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type permissionOverridesStreamCursorValueInput = {
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
export type permissionOverridesUpdateColumn =
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
  | 'userId';

export type permissionOverridesUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<permissionOverridesAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _deleteAtPath?: InputMaybe<permissionOverridesDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _deleteElem?: InputMaybe<permissionOverridesDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _deleteKey?: InputMaybe<permissionOverridesDeleteKeyInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<permissionOverridesPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<permissionOverridesSetInput>;
  /** filter the rows which have to be updated */
  where: permissionOverridesBoolExp;
};

/** columns and relationships of "audit.permission_usage_report" */
export type permissionUsageReports = {
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
export type permissionUsageReportsAggregate = {
  __typename?: 'permissionUsageReportsAggregate';
  aggregate?: Maybe<permissionUsageReportsAggregateFields>;
  nodes: Array<permissionUsageReports>;
};

/** aggregate fields of "audit.permission_usage_report" */
export type permissionUsageReportsAggregateFields = {
  __typename?: 'permissionUsageReportsAggregateFields';
  avg?: Maybe<permissionUsageReportsAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<permissionUsageReportsMaxFields>;
  min?: Maybe<permissionUsageReportsMinFields>;
  stddev?: Maybe<permissionUsageReportsStddevFields>;
  stddevPop?: Maybe<permissionUsageReportsStddevPopFields>;
  stddevSamp?: Maybe<permissionUsageReportsStddevSampFields>;
  sum?: Maybe<permissionUsageReportsSumFields>;
  varPop?: Maybe<permissionUsageReportsVarPopFields>;
  varSamp?: Maybe<permissionUsageReportsVarSampFields>;
  variance?: Maybe<permissionUsageReportsVarianceFields>;
};


/** aggregate fields of "audit.permission_usage_report" */
export type permissionUsageReportsAggregateFieldscountArgs = {
  columns?: InputMaybe<Array<permissionUsageReportsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type permissionUsageReportsAvgFields = {
  __typename?: 'permissionUsageReportsAvgFields';
  totalUsageCount?: Maybe<Scalars['Float']['output']>;
  usersWhoUsedPermission?: Maybe<Scalars['Float']['output']>;
  usersWithPermission?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "audit.permission_usage_report". All fields are combined with a logical 'AND'. */
export type permissionUsageReportsBoolExp = {
  _and?: InputMaybe<Array<permissionUsageReportsBoolExp>>;
  _not?: InputMaybe<permissionUsageReportsBoolExp>;
  _or?: InputMaybe<Array<permissionUsageReportsBoolExp>>;
  action?: InputMaybe<PermissionActionComparisonExp>;
  lastUsed?: InputMaybe<TimestamptzComparisonExp>;
  resourceName?: InputMaybe<StringComparisonExp>;
  roleName?: InputMaybe<StringComparisonExp>;
  totalUsageCount?: InputMaybe<BigintComparisonExp>;
  usersWhoUsedPermission?: InputMaybe<BigintComparisonExp>;
  usersWithPermission?: InputMaybe<BigintComparisonExp>;
};

/** aggregate max on columns */
export type permissionUsageReportsMaxFields = {
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
export type permissionUsageReportsMinFields = {
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
export type permissionUsageReportsOrderBy = {
  action?: InputMaybe<OrderBy>;
  lastUsed?: InputMaybe<OrderBy>;
  resourceName?: InputMaybe<OrderBy>;
  roleName?: InputMaybe<OrderBy>;
  totalUsageCount?: InputMaybe<OrderBy>;
  usersWhoUsedPermission?: InputMaybe<OrderBy>;
  usersWithPermission?: InputMaybe<OrderBy>;
};

/** select columns of table "audit.permission_usage_report" */
export type permissionUsageReportsSelectColumn =
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
  | 'usersWithPermission';

/** aggregate stddev on columns */
export type permissionUsageReportsStddevFields = {
  __typename?: 'permissionUsageReportsStddevFields';
  totalUsageCount?: Maybe<Scalars['Float']['output']>;
  usersWhoUsedPermission?: Maybe<Scalars['Float']['output']>;
  usersWithPermission?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddevPop on columns */
export type permissionUsageReportsStddevPopFields = {
  __typename?: 'permissionUsageReportsStddevPopFields';
  totalUsageCount?: Maybe<Scalars['Float']['output']>;
  usersWhoUsedPermission?: Maybe<Scalars['Float']['output']>;
  usersWithPermission?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddevSamp on columns */
export type permissionUsageReportsStddevSampFields = {
  __typename?: 'permissionUsageReportsStddevSampFields';
  totalUsageCount?: Maybe<Scalars['Float']['output']>;
  usersWhoUsedPermission?: Maybe<Scalars['Float']['output']>;
  usersWithPermission?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "permissionUsageReports" */
export type permissionUsageReportsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: permissionUsageReportsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type permissionUsageReportsStreamCursorValueInput = {
  action?: InputMaybe<Scalars['permission_action']['input']>;
  lastUsed?: InputMaybe<Scalars['timestamptz']['input']>;
  resourceName?: InputMaybe<Scalars['String']['input']>;
  roleName?: InputMaybe<Scalars['String']['input']>;
  totalUsageCount?: InputMaybe<Scalars['bigint']['input']>;
  usersWhoUsedPermission?: InputMaybe<Scalars['bigint']['input']>;
  usersWithPermission?: InputMaybe<Scalars['bigint']['input']>;
};

/** aggregate sum on columns */
export type permissionUsageReportsSumFields = {
  __typename?: 'permissionUsageReportsSumFields';
  totalUsageCount?: Maybe<Scalars['bigint']['output']>;
  usersWhoUsedPermission?: Maybe<Scalars['bigint']['output']>;
  usersWithPermission?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate varPop on columns */
export type permissionUsageReportsVarPopFields = {
  __typename?: 'permissionUsageReportsVarPopFields';
  totalUsageCount?: Maybe<Scalars['Float']['output']>;
  usersWhoUsedPermission?: Maybe<Scalars['Float']['output']>;
  usersWithPermission?: Maybe<Scalars['Float']['output']>;
};

/** aggregate varSamp on columns */
export type permissionUsageReportsVarSampFields = {
  __typename?: 'permissionUsageReportsVarSampFields';
  totalUsageCount?: Maybe<Scalars['Float']['output']>;
  usersWhoUsedPermission?: Maybe<Scalars['Float']['output']>;
  usersWithPermission?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type permissionUsageReportsVarianceFields = {
  __typename?: 'permissionUsageReportsVarianceFields';
  totalUsageCount?: Maybe<Scalars['Float']['output']>;
  usersWhoUsedPermission?: Maybe<Scalars['Float']['output']>;
  usersWithPermission?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "permissions" */
export type permissions = {
  __typename?: 'permissions';
  action: Scalars['permission_action']['output'];
  /** An array relationship */
  assignedToRoles: Array<rolePermissions>;
  /** An aggregate relationship */
  assignedToRolesAggregate: rolePermissionsAggregate;
  createdAt: Scalars['timestamptz']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['uuid']['output'];
  legacyPermissionName?: Maybe<Scalars['String']['output']>;
  /** An object relationship */
  relatedResource: resources;
  resourceId: Scalars['uuid']['output'];
  updatedAt: Scalars['timestamptz']['output'];
};


/** columns and relationships of "permissions" */
export type permissionsassignedToRolesArgs = {
  distinctOn?: InputMaybe<Array<rolePermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<rolePermissionsOrderBy>>;
  where?: InputMaybe<rolePermissionsBoolExp>;
};


/** columns and relationships of "permissions" */
export type permissionsassignedToRolesAggregateArgs = {
  distinctOn?: InputMaybe<Array<rolePermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<rolePermissionsOrderBy>>;
  where?: InputMaybe<rolePermissionsBoolExp>;
};

/** aggregated selection of "permissions" */
export type permissionsAggregate = {
  __typename?: 'permissionsAggregate';
  aggregate?: Maybe<permissionsAggregateFields>;
  nodes: Array<permissions>;
};

export type permissionsAggregateBoolExp = {
  count?: InputMaybe<permissionsAggregateBoolExpCount>;
};

export type permissionsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<permissionsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<permissionsBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "permissions" */
export type permissionsAggregateFields = {
  __typename?: 'permissionsAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<permissionsMaxFields>;
  min?: Maybe<permissionsMinFields>;
};


/** aggregate fields of "permissions" */
export type permissionsAggregateFieldscountArgs = {
  columns?: InputMaybe<Array<permissionsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "permissions" */
export type permissionsAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<permissionsMaxOrderBy>;
  min?: InputMaybe<permissionsMinOrderBy>;
};

/** input type for inserting array relation for remote table "permissions" */
export type permissionsArrRelInsertInput = {
  data: Array<permissionsInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<permissionsOnConflict>;
};

/** Boolean expression to filter rows from the table "permissions". All fields are combined with a logical 'AND'. */
export type permissionsBoolExp = {
  _and?: InputMaybe<Array<permissionsBoolExp>>;
  _not?: InputMaybe<permissionsBoolExp>;
  _or?: InputMaybe<Array<permissionsBoolExp>>;
  action?: InputMaybe<PermissionActionComparisonExp>;
  assignedToRoles?: InputMaybe<rolePermissionsBoolExp>;
  assignedToRolesAggregate?: InputMaybe<rolePermissionsAggregateBoolExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  description?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  legacyPermissionName?: InputMaybe<StringComparisonExp>;
  relatedResource?: InputMaybe<resourcesBoolExp>;
  resourceId?: InputMaybe<UuidComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "permissions" */
export type permissionsConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'permissions_pkey'
  /** unique or primary key constraint on columns "action", "resource_id" */
  | 'permissions_resource_id_action_key';

/** input type for inserting data into table "permissions" */
export type permissionsInsertInput = {
  action?: InputMaybe<Scalars['permission_action']['input']>;
  assignedToRoles?: InputMaybe<rolePermissionsArrRelInsertInput>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  legacyPermissionName?: InputMaybe<Scalars['String']['input']>;
  relatedResource?: InputMaybe<resourcesObjRelInsertInput>;
  resourceId?: InputMaybe<Scalars['uuid']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type permissionsMaxFields = {
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
export type permissionsMaxOrderBy = {
  action?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  legacyPermissionName?: InputMaybe<OrderBy>;
  resourceId?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type permissionsMinFields = {
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
export type permissionsMinOrderBy = {
  action?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  legacyPermissionName?: InputMaybe<OrderBy>;
  resourceId?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "permissions" */
export type permissionsMutationResponse = {
  __typename?: 'permissionsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<permissions>;
};

/** input type for inserting object relation for remote table "permissions" */
export type permissionsObjRelInsertInput = {
  data: permissionsInsertInput;
  /** upsert condition */
  onConflict?: InputMaybe<permissionsOnConflict>;
};

/** on_conflict condition type for table "permissions" */
export type permissionsOnConflict = {
  constraint: permissionsConstraint;
  updateColumns?: Array<permissionsUpdateColumn>;
  where?: InputMaybe<permissionsBoolExp>;
};

/** Ordering options when selecting data from "permissions". */
export type permissionsOrderBy = {
  action?: InputMaybe<OrderBy>;
  assignedToRolesAggregate?: InputMaybe<rolePermissionsAggregateOrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  legacyPermissionName?: InputMaybe<OrderBy>;
  relatedResource?: InputMaybe<resourcesOrderBy>;
  resourceId?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: permissions */
export type permissionsPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "permissions" */
export type permissionsSelectColumn =
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
  | 'updatedAt';

/** input type for updating data in table "permissions" */
export type permissionsSetInput = {
  action?: InputMaybe<Scalars['permission_action']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  legacyPermissionName?: InputMaybe<Scalars['String']['input']>;
  resourceId?: InputMaybe<Scalars['uuid']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "permissions" */
export type permissionsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: permissionsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type permissionsStreamCursorValueInput = {
  action?: InputMaybe<Scalars['permission_action']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  legacyPermissionName?: InputMaybe<Scalars['String']['input']>;
  resourceId?: InputMaybe<Scalars['uuid']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** update columns of table "permissions" */
export type permissionsUpdateColumn =
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
  | 'updatedAt';

export type permissionsUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<permissionsSetInput>;
  /** filter the rows which have to be updated */
  where: permissionsBoolExp;
};

export type query_root = {
  __typename?: 'query_root';
  /** query _Entity union */
  _entities?: Maybe<_Entity>;
  _service: _Service;
  /** execute function "activate_payroll_versions" which returns "payroll_activation_results" */
  activatePayrollVersions: Array<payrollActivationResults>;
  /** execute function "activate_payroll_versions" and query aggregates on result of table type "payroll_activation_results" */
  activatePayrollVersionsAggregate: payrollActivationResultsAggregate;
  /** fetch data from the table: "adjustment_rules" using primary key columns */
  adjustmentRuleById?: Maybe<adjustmentRules>;
  /** An array relationship */
  adjustmentRules: Array<adjustmentRules>;
  /** An aggregate relationship */
  adjustmentRulesAggregate: adjustmentRulesAggregate;
  /** fetch data from the table: "app_settings" using primary key columns */
  appSettingById?: Maybe<appSettings>;
  /** fetch data from the table: "app_settings" */
  appSettings: Array<appSettings>;
  /** fetch aggregated fields from the table: "app_settings" */
  appSettingsAggregate: appSettingsAggregate;
  /** fetch data from the table: "audit.audit_log" using primary key columns */
  auditLogById?: Maybe<auditLogs>;
  /** fetch data from the table: "audit.audit_log" */
  auditLogs: Array<auditLogs>;
  /** fetch aggregated fields from the table: "audit.audit_log" */
  auditLogsAggregate: auditLogsAggregate;
  /** fetch data from the table: "audit.auth_events" using primary key columns */
  authEventById?: Maybe<authEvents>;
  /** fetch data from the table: "audit.auth_events" */
  authEvents: Array<authEvents>;
  /** fetch aggregated fields from the table: "audit.auth_events" */
  authEventsAggregate: authEventsAggregate;
  /** fetch data from the table: "billing_event_log" using primary key columns */
  billingEventLogById?: Maybe<billingEventLogs>;
  /** An array relationship */
  billingEventLogs: Array<billingEventLogs>;
  /** An aggregate relationship */
  billingEventLogsAggregate: billingEventLogsAggregate;
  /** fetch data from the table: "billing_invoice" */
  billingInvoice: Array<billingInvoice>;
  /** fetch aggregated fields from the table: "billing_invoice" */
  billingInvoiceAggregate: billingInvoiceAggregate;
  /** fetch data from the table: "billing_invoice" using primary key columns */
  billingInvoiceById?: Maybe<billingInvoice>;
  /** fetch data from the table: "billing_invoice_item" */
  billingInvoiceItem: Array<BillingInvoiceItem>;
  /** fetch aggregated fields from the table: "billing_invoice_item" */
  billingInvoiceItemAggregate: BillingInvoiceItemAggregate;
  /** fetch data from the table: "billing_invoice_item" using primary key columns */
  billingInvoiceItemByPk?: Maybe<BillingInvoiceItem>;
  /** fetch data from the table: "billing_items" using primary key columns */
  billingItemById?: Maybe<billingItems>;
  /** An array relationship */
  billingItems: Array<billingItems>;
  /** An aggregate relationship */
  billingItemsAggregate: billingItemsAggregate;
  /** fetch data from the table: "billing_plan" using primary key columns */
  billingPlanById?: Maybe<billingPlans>;
  /** fetch data from the table: "billing_plan" */
  billingPlans: Array<billingPlans>;
  /** fetch aggregated fields from the table: "billing_plan" */
  billingPlansAggregate: billingPlansAggregate;
  /** fetch data from the table: "client_billing_assignment" using primary key columns */
  clientBillingAssignmentById?: Maybe<clientBillingAssignments>;
  /** An array relationship */
  clientBillingAssignments: Array<clientBillingAssignments>;
  /** An aggregate relationship */
  clientBillingAssignmentsAggregate: clientBillingAssignmentsAggregate;
  /** fetch data from the table: "clients" using primary key columns */
  clientById?: Maybe<clients>;
  /** fetch data from the table: "client_external_systems" using primary key columns */
  clientExternalSystemById?: Maybe<clientExternalSystems>;
  /** An array relationship */
  clientExternalSystems: Array<clientExternalSystems>;
  /** An aggregate relationship */
  clientExternalSystemsAggregate: clientExternalSystemsAggregate;
  /** fetch data from the table: "clients" */
  clients: Array<clients>;
  /** fetch aggregated fields from the table: "clients" */
  clientsAggregate: clientsAggregate;
  /** execute function "create_payroll_version" which returns "payroll_version_results" */
  createPayrollVersion: Array<payrollVersionResults>;
  /** execute function "create_payroll_version" and query aggregates on result of table type "payroll_version_results" */
  createPayrollVersionAggregate: payrollVersionResultsAggregate;
  /** execute function "create_payroll_version_simple" which returns "payroll_version_results" */
  createPayrollVersionSimple: Array<payrollVersionResults>;
  /** execute function "create_payroll_version_simple" and query aggregates on result of table type "payroll_version_results" */
  createPayrollVersionSimpleAggregate: payrollVersionResultsAggregate;
  /** fetch data from the table: "current_payrolls" */
  currentPayrolls: Array<currentPayrolls>;
  /** fetch aggregated fields from the table: "current_payrolls" */
  currentPayrollsAggregate: currentPayrollsAggregate;
  /** fetch data from the table: "audit.data_access_log" using primary key columns */
  dataAccessLogById?: Maybe<dataAccessLogs>;
  /** fetch data from the table: "audit.data_access_log" */
  dataAccessLogs: Array<dataAccessLogs>;
  /** fetch aggregated fields from the table: "audit.data_access_log" */
  dataAccessLogsAggregate: dataAccessLogsAggregate;
  /** fetch data from the table: "external_systems" using primary key columns */
  externalSystemById?: Maybe<externalSystems>;
  /** fetch data from the table: "external_systems" */
  externalSystems: Array<externalSystems>;
  /** fetch aggregated fields from the table: "external_systems" */
  externalSystemsAggregate: externalSystemsAggregate;
  /** fetch data from the table: "feature_flags" using primary key columns */
  featureFlagById?: Maybe<featureFlags>;
  /** fetch data from the table: "feature_flags" */
  featureFlags: Array<featureFlags>;
  /** fetch aggregated fields from the table: "feature_flags" */
  featureFlagsAggregate: featureFlagsAggregate;
  /** execute function "generate_payroll_dates" which returns "payroll_dates" */
  generatePayrollDates: Array<payrollDates>;
  /** execute function "generate_payroll_dates" and query aggregates on result of table type "payroll_dates" */
  generatePayrollDatesAggregate: payrollDatesAggregate;
  /** execute function "get_latest_payroll_version" which returns "latest_payroll_version_results" */
  getLatestPayrollVersion: Array<latestPayrollVersionResults>;
  /** execute function "get_latest_payroll_version" and query aggregates on result of table type "latest_payroll_version_results" */
  getLatestPayrollVersionAggregate: latestPayrollVersionResultsAggregate;
  /** execute function "get_payroll_version_history" which returns "payroll_version_history_results" */
  getPayrollVersionHistory: Array<payrollVersionHistoryResults>;
  /** execute function "get_payroll_version_history" and query aggregates on result of table type "payroll_version_history_results" */
  getPayrollVersionHistoryAggregate: payrollVersionHistoryResultsAggregate;
  /** fetch data from the table: "holidays" using primary key columns */
  holidayById?: Maybe<holidays>;
  /** fetch data from the table: "holidays" */
  holidays: Array<holidays>;
  /** fetch aggregated fields from the table: "holidays" */
  holidaysAggregate: holidaysAggregate;
  /** fetch data from the table: "latest_payroll_version_results" using primary key columns */
  latestPayrollVersionResultById?: Maybe<latestPayrollVersionResults>;
  /** fetch data from the table: "latest_payroll_version_results" */
  latestPayrollVersionResults: Array<latestPayrollVersionResults>;
  /** fetch aggregated fields from the table: "latest_payroll_version_results" */
  latestPayrollVersionResultsAggregate: latestPayrollVersionResultsAggregate;
  /** fetch data from the table: "leave" */
  leave: Array<leave>;
  /** fetch aggregated fields from the table: "leave" */
  leaveAggregate: leaveAggregate;
  /** fetch data from the table: "leave" using primary key columns */
  leaveById?: Maybe<leave>;
  /** fetch data from the table: "notes" using primary key columns */
  noteById?: Maybe<notes>;
  /** fetch data from the table: "notes" */
  notes: Array<notes>;
  /** fetch aggregated fields from the table: "notes" */
  notesAggregate: notesAggregate;
  /** fetch data from the table: "payroll_activation_results" using primary key columns */
  payrollActivationResultById?: Maybe<payrollActivationResults>;
  /** fetch data from the table: "payroll_activation_results" */
  payrollActivationResults: Array<payrollActivationResults>;
  /** fetch aggregated fields from the table: "payroll_activation_results" */
  payrollActivationResultsAggregate: payrollActivationResultsAggregate;
  /** fetch data from the table: "payroll_assignment_audit" using primary key columns */
  payrollAssignmentAuditById?: Maybe<payrollAssignmentAudits>;
  /** An array relationship */
  payrollAssignmentAudits: Array<payrollAssignmentAudits>;
  /** An aggregate relationship */
  payrollAssignmentAuditsAggregate: payrollAssignmentAuditsAggregate;
  /** fetch data from the table: "payroll_assignments" using primary key columns */
  payrollAssignmentById?: Maybe<payrollAssignments>;
  /** fetch data from the table: "payroll_assignments" */
  payrollAssignments: Array<payrollAssignments>;
  /** fetch aggregated fields from the table: "payroll_assignments" */
  payrollAssignmentsAggregate: payrollAssignmentsAggregate;
  /** fetch data from the table: "payrolls" using primary key columns */
  payrollById?: Maybe<payrolls>;
  /** fetch data from the table: "payroll_cycles" using primary key columns */
  payrollCycleById?: Maybe<payrollCycles>;
  /** fetch data from the table: "payroll_cycles" */
  payrollCycles: Array<payrollCycles>;
  /** fetch aggregated fields from the table: "payroll_cycles" */
  payrollCyclesAggregate: payrollCyclesAggregate;
  /** fetch data from the table: "payroll_dashboard_stats" */
  payrollDashboardStats: Array<payrollDashboardStats>;
  /** fetch aggregated fields from the table: "payroll_dashboard_stats" */
  payrollDashboardStatsAggregate: payrollDashboardStatsAggregate;
  /** fetch data from the table: "payroll_dates" using primary key columns */
  payrollDateById?: Maybe<payrollDates>;
  /** fetch data from the table: "payroll_date_types" using primary key columns */
  payrollDateTypeById?: Maybe<payrollDateTypes>;
  /** fetch data from the table: "payroll_date_types" */
  payrollDateTypes: Array<payrollDateTypes>;
  /** fetch aggregated fields from the table: "payroll_date_types" */
  payrollDateTypesAggregate: payrollDateTypesAggregate;
  /** An array relationship */
  payrollDates: Array<payrollDates>;
  /** An aggregate relationship */
  payrollDatesAggregate: payrollDatesAggregate;
  /** fetch data from the table: "payroll_triggers_status" */
  payrollTriggersStatus: Array<payrollTriggersStatus>;
  /** fetch aggregated fields from the table: "payroll_triggers_status" */
  payrollTriggersStatusAggregate: payrollTriggersStatusAggregate;
  /** fetch data from the table: "payroll_version_history_results" using primary key columns */
  payrollVersionHistoryResultById?: Maybe<payrollVersionHistoryResults>;
  /** fetch data from the table: "payroll_version_history_results" */
  payrollVersionHistoryResults: Array<payrollVersionHistoryResults>;
  /** fetch aggregated fields from the table: "payroll_version_history_results" */
  payrollVersionHistoryResultsAggregate: payrollVersionHistoryResultsAggregate;
  /** fetch data from the table: "payroll_version_results" using primary key columns */
  payrollVersionResultById?: Maybe<payrollVersionResults>;
  /** fetch data from the table: "payroll_version_results" */
  payrollVersionResults: Array<payrollVersionResults>;
  /** fetch aggregated fields from the table: "payroll_version_results" */
  payrollVersionResultsAggregate: payrollVersionResultsAggregate;
  /** An array relationship */
  payrolls: Array<payrolls>;
  /** An aggregate relationship */
  payrollsAggregate: payrollsAggregate;
  /** fetch data from the table: "permission_audit_log" using primary key columns */
  permissionAuditLogById?: Maybe<permissionAuditLogs>;
  /** fetch data from the table: "permission_audit_log" */
  permissionAuditLogs: Array<permissionAuditLogs>;
  /** fetch aggregated fields from the table: "permission_audit_log" */
  permissionAuditLogsAggregate: permissionAuditLogsAggregate;
  /** fetch data from the table: "permissions" using primary key columns */
  permissionById?: Maybe<permissions>;
  /** fetch data from the table: "audit.permission_changes" using primary key columns */
  permissionChangeById?: Maybe<permissionChanges>;
  /** fetch data from the table: "audit.permission_changes" */
  permissionChanges: Array<permissionChanges>;
  /** fetch aggregated fields from the table: "audit.permission_changes" */
  permissionChangesAggregate: permissionChangesAggregate;
  /** fetch data from the table: "permission_overrides" using primary key columns */
  permissionOverrideById?: Maybe<permissionOverrides>;
  /** fetch data from the table: "permission_overrides" */
  permissionOverrides: Array<permissionOverrides>;
  /** fetch aggregated fields from the table: "permission_overrides" */
  permissionOverridesAggregate: permissionOverridesAggregate;
  /** fetch data from the table: "audit.permission_usage_report" */
  permissionUsageReports: Array<permissionUsageReports>;
  /** fetch aggregated fields from the table: "audit.permission_usage_report" */
  permissionUsageReportsAggregate: permissionUsageReportsAggregate;
  /** fetch data from the table: "permissions" */
  permissions: Array<permissions>;
  /** fetch aggregated fields from the table: "permissions" */
  permissionsAggregate: permissionsAggregate;
  /** fetch data from the table: "resources" using primary key columns */
  resourceById?: Maybe<resources>;
  /** fetch data from the table: "resources" */
  resources: Array<resources>;
  /** fetch aggregated fields from the table: "resources" */
  resourcesAggregate: resourcesAggregate;
  /** fetch data from the table: "roles" using primary key columns */
  roleById?: Maybe<roles>;
  /** fetch data from the table: "role_permissions" using primary key columns */
  rolePermissionById?: Maybe<rolePermissions>;
  /** fetch data from the table: "role_permissions" */
  rolePermissions: Array<rolePermissions>;
  /** fetch aggregated fields from the table: "role_permissions" */
  rolePermissionsAggregate: rolePermissionsAggregate;
  /** fetch data from the table: "roles" */
  roles: Array<roles>;
  /** fetch aggregated fields from the table: "roles" */
  rolesAggregate: rolesAggregate;
  /** fetch data from the table: "audit.slow_queries" */
  slowQueries: Array<slowQueries>;
  /** fetch aggregated fields from the table: "audit.slow_queries" */
  slowQueriesAggregate: slowQueriesAggregate;
  /** fetch data from the table: "audit.slow_queries" using primary key columns */
  slowQueryById?: Maybe<slowQueries>;
  /** fetch data from the table: "audit.user_access_summary" */
  userAccessSummaries: Array<userAccessSummaries>;
  /** fetch aggregated fields from the table: "audit.user_access_summary" */
  userAccessSummariesAggregate: userAccessSummariesAggregate;
  /** fetch data from the table: "users" using primary key columns */
  userById?: Maybe<users>;
  /** fetch data from the table: "user_invitations" using primary key columns */
  userInvitationById?: Maybe<userInvitations>;
  /** fetch data from the table: "user_invitations" */
  userInvitations: Array<userInvitations>;
  /** fetch aggregated fields from the table: "user_invitations" */
  userInvitationsAggregate: userInvitationsAggregate;
  /** fetch data from the table: "user_roles" using primary key columns */
  userRoleById?: Maybe<userRoles>;
  /** fetch data from the table: "user_roles" */
  userRoles: Array<userRoles>;
  /** fetch aggregated fields from the table: "user_roles" */
  userRolesAggregate: userRolesAggregate;
  /** fetch data from the table: "neon_auth.users_sync" using primary key columns */
  userSyncById?: Maybe<authUsersSync>;
  /** fetch data from the table: "users" */
  users: Array<users>;
  /** fetch aggregated fields from the table: "users" */
  usersAggregate: usersAggregate;
  /** fetch data from the table: "users_role_backup" */
  usersRoleBackups: Array<usersRoleBackup>;
  /** fetch aggregated fields from the table: "users_role_backup" */
  usersRoleBackupsAggregate: usersRoleBackupAggregate;
  /** fetch data from the table: "neon_auth.users_sync" */
  usersSync: Array<authUsersSync>;
  /** fetch aggregated fields from the table: "neon_auth.users_sync" */
  usersSyncAggregate: authUsersSyncAggregate;
  /** fetch data from the table: "work_schedule" using primary key columns */
  workScheduleById?: Maybe<workSchedules>;
  /** fetch data from the table: "work_schedule" */
  workSchedules: Array<workSchedules>;
  /** fetch aggregated fields from the table: "work_schedule" */
  workSchedulesAggregate: workSchedulesAggregate;
};


export type query_root_entitiesArgs = {
  representations: Array<Scalars['_Any']['input']>;
};


export type query_rootactivatePayrollVersionsArgs = {
  distinctOn?: InputMaybe<Array<payrollActivationResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollActivationResultsOrderBy>>;
  where?: InputMaybe<payrollActivationResultsBoolExp>;
};


export type query_rootactivatePayrollVersionsAggregateArgs = {
  distinctOn?: InputMaybe<Array<payrollActivationResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollActivationResultsOrderBy>>;
  where?: InputMaybe<payrollActivationResultsBoolExp>;
};


export type query_rootadjustmentRuleByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type query_rootadjustmentRulesArgs = {
  distinctOn?: InputMaybe<Array<adjustmentRulesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<adjustmentRulesOrderBy>>;
  where?: InputMaybe<adjustmentRulesBoolExp>;
};


export type query_rootadjustmentRulesAggregateArgs = {
  distinctOn?: InputMaybe<Array<adjustmentRulesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<adjustmentRulesOrderBy>>;
  where?: InputMaybe<adjustmentRulesBoolExp>;
};


export type query_rootappSettingByIdArgs = {
  id: Scalars['String']['input'];
};


export type query_rootappSettingsArgs = {
  distinctOn?: InputMaybe<Array<appSettingsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<appSettingsOrderBy>>;
  where?: InputMaybe<appSettingsBoolExp>;
};


export type query_rootappSettingsAggregateArgs = {
  distinctOn?: InputMaybe<Array<appSettingsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<appSettingsOrderBy>>;
  where?: InputMaybe<appSettingsBoolExp>;
};


export type query_rootauditLogByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type query_rootauditLogsArgs = {
  distinctOn?: InputMaybe<Array<auditLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<auditLogsOrderBy>>;
  where?: InputMaybe<auditLogsBoolExp>;
};


export type query_rootauditLogsAggregateArgs = {
  distinctOn?: InputMaybe<Array<auditLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<auditLogsOrderBy>>;
  where?: InputMaybe<auditLogsBoolExp>;
};


export type query_rootauthEventByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type query_rootauthEventsArgs = {
  distinctOn?: InputMaybe<Array<authEventsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<authEventsOrderBy>>;
  where?: InputMaybe<authEventsBoolExp>;
};


export type query_rootauthEventsAggregateArgs = {
  distinctOn?: InputMaybe<Array<authEventsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<authEventsOrderBy>>;
  where?: InputMaybe<authEventsBoolExp>;
};


export type query_rootbillingEventLogByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type query_rootbillingEventLogsArgs = {
  distinctOn?: InputMaybe<Array<billingEventLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<billingEventLogsOrderBy>>;
  where?: InputMaybe<billingEventLogsBoolExp>;
};


export type query_rootbillingEventLogsAggregateArgs = {
  distinctOn?: InputMaybe<Array<billingEventLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<billingEventLogsOrderBy>>;
  where?: InputMaybe<billingEventLogsBoolExp>;
};


export type query_rootbillingInvoiceArgs = {
  distinctOn?: InputMaybe<Array<billingInvoiceSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<billingInvoiceOrderBy>>;
  where?: InputMaybe<billingInvoiceBoolExp>;
};


export type query_rootbillingInvoiceAggregateArgs = {
  distinctOn?: InputMaybe<Array<billingInvoiceSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<billingInvoiceOrderBy>>;
  where?: InputMaybe<billingInvoiceBoolExp>;
};


export type query_rootbillingInvoiceByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type query_rootbillingInvoiceItemArgs = {
  distinctOn?: InputMaybe<Array<BillingInvoiceItemSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BillingInvoiceItemOrderBy>>;
  where?: InputMaybe<BillingInvoiceItemBoolExp>;
};


export type query_rootbillingInvoiceItemAggregateArgs = {
  distinctOn?: InputMaybe<Array<BillingInvoiceItemSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BillingInvoiceItemOrderBy>>;
  where?: InputMaybe<BillingInvoiceItemBoolExp>;
};


export type query_rootbillingInvoiceItemByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type query_rootbillingItemByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type query_rootbillingItemsArgs = {
  distinctOn?: InputMaybe<Array<billingItemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<billingItemsOrderBy>>;
  where?: InputMaybe<billingItemsBoolExp>;
};


export type query_rootbillingItemsAggregateArgs = {
  distinctOn?: InputMaybe<Array<billingItemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<billingItemsOrderBy>>;
  where?: InputMaybe<billingItemsBoolExp>;
};


export type query_rootbillingPlanByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type query_rootbillingPlansArgs = {
  distinctOn?: InputMaybe<Array<billingPlansSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<billingPlansOrderBy>>;
  where?: InputMaybe<billingPlansBoolExp>;
};


export type query_rootbillingPlansAggregateArgs = {
  distinctOn?: InputMaybe<Array<billingPlansSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<billingPlansOrderBy>>;
  where?: InputMaybe<billingPlansBoolExp>;
};


export type query_rootclientBillingAssignmentByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type query_rootclientBillingAssignmentsArgs = {
  distinctOn?: InputMaybe<Array<clientBillingAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<clientBillingAssignmentsOrderBy>>;
  where?: InputMaybe<clientBillingAssignmentsBoolExp>;
};


export type query_rootclientBillingAssignmentsAggregateArgs = {
  distinctOn?: InputMaybe<Array<clientBillingAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<clientBillingAssignmentsOrderBy>>;
  where?: InputMaybe<clientBillingAssignmentsBoolExp>;
};


export type query_rootclientByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type query_rootclientExternalSystemByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type query_rootclientExternalSystemsArgs = {
  distinctOn?: InputMaybe<Array<clientExternalSystemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<clientExternalSystemsOrderBy>>;
  where?: InputMaybe<clientExternalSystemsBoolExp>;
};


export type query_rootclientExternalSystemsAggregateArgs = {
  distinctOn?: InputMaybe<Array<clientExternalSystemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<clientExternalSystemsOrderBy>>;
  where?: InputMaybe<clientExternalSystemsBoolExp>;
};


export type query_rootclientsArgs = {
  distinctOn?: InputMaybe<Array<clientsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<clientsOrderBy>>;
  where?: InputMaybe<clientsBoolExp>;
};


export type query_rootclientsAggregateArgs = {
  distinctOn?: InputMaybe<Array<clientsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<clientsOrderBy>>;
  where?: InputMaybe<clientsBoolExp>;
};


export type query_rootcreatePayrollVersionArgs = {
  args: createPayrollVersionArgs;
  distinctOn?: InputMaybe<Array<payrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollVersionResultsOrderBy>>;
  where?: InputMaybe<payrollVersionResultsBoolExp>;
};


export type query_rootcreatePayrollVersionAggregateArgs = {
  args: createPayrollVersionArgs;
  distinctOn?: InputMaybe<Array<payrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollVersionResultsOrderBy>>;
  where?: InputMaybe<payrollVersionResultsBoolExp>;
};


export type query_rootcreatePayrollVersionSimpleArgs = {
  args: createPayrollVersionSimpleArgs;
  distinctOn?: InputMaybe<Array<payrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollVersionResultsOrderBy>>;
  where?: InputMaybe<payrollVersionResultsBoolExp>;
};


export type query_rootcreatePayrollVersionSimpleAggregateArgs = {
  args: createPayrollVersionSimpleArgs;
  distinctOn?: InputMaybe<Array<payrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollVersionResultsOrderBy>>;
  where?: InputMaybe<payrollVersionResultsBoolExp>;
};


export type query_rootcurrentPayrollsArgs = {
  distinctOn?: InputMaybe<Array<currentPayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<currentPayrollsOrderBy>>;
  where?: InputMaybe<currentPayrollsBoolExp>;
};


export type query_rootcurrentPayrollsAggregateArgs = {
  distinctOn?: InputMaybe<Array<currentPayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<currentPayrollsOrderBy>>;
  where?: InputMaybe<currentPayrollsBoolExp>;
};


export type query_rootdataAccessLogByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type query_rootdataAccessLogsArgs = {
  distinctOn?: InputMaybe<Array<dataAccessLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<dataAccessLogsOrderBy>>;
  where?: InputMaybe<dataAccessLogsBoolExp>;
};


export type query_rootdataAccessLogsAggregateArgs = {
  distinctOn?: InputMaybe<Array<dataAccessLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<dataAccessLogsOrderBy>>;
  where?: InputMaybe<dataAccessLogsBoolExp>;
};


export type query_rootexternalSystemByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type query_rootexternalSystemsArgs = {
  distinctOn?: InputMaybe<Array<externalSystemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<externalSystemsOrderBy>>;
  where?: InputMaybe<externalSystemsBoolExp>;
};


export type query_rootexternalSystemsAggregateArgs = {
  distinctOn?: InputMaybe<Array<externalSystemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<externalSystemsOrderBy>>;
  where?: InputMaybe<externalSystemsBoolExp>;
};


export type query_rootfeatureFlagByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type query_rootfeatureFlagsArgs = {
  distinctOn?: InputMaybe<Array<featureFlagsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<featureFlagsOrderBy>>;
  where?: InputMaybe<featureFlagsBoolExp>;
};


export type query_rootfeatureFlagsAggregateArgs = {
  distinctOn?: InputMaybe<Array<featureFlagsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<featureFlagsOrderBy>>;
  where?: InputMaybe<featureFlagsBoolExp>;
};


export type query_rootgeneratePayrollDatesArgs = {
  args: generatePayrollDatesArgs;
  distinctOn?: InputMaybe<Array<payrollDatesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollDatesOrderBy>>;
  where?: InputMaybe<payrollDatesBoolExp>;
};


export type query_rootgeneratePayrollDatesAggregateArgs = {
  args: generatePayrollDatesArgs;
  distinctOn?: InputMaybe<Array<payrollDatesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollDatesOrderBy>>;
  where?: InputMaybe<payrollDatesBoolExp>;
};


export type query_rootgetLatestPayrollVersionArgs = {
  args: getLatestPayrollVersionArgs;
  distinctOn?: InputMaybe<Array<latestPayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<latestPayrollVersionResultsOrderBy>>;
  where?: InputMaybe<latestPayrollVersionResultsBoolExp>;
};


export type query_rootgetLatestPayrollVersionAggregateArgs = {
  args: getLatestPayrollVersionArgs;
  distinctOn?: InputMaybe<Array<latestPayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<latestPayrollVersionResultsOrderBy>>;
  where?: InputMaybe<latestPayrollVersionResultsBoolExp>;
};


export type query_rootgetPayrollVersionHistoryArgs = {
  args: getPayrollVersionHistoryArgs;
  distinctOn?: InputMaybe<Array<payrollVersionHistoryResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollVersionHistoryResultsOrderBy>>;
  where?: InputMaybe<payrollVersionHistoryResultsBoolExp>;
};


export type query_rootgetPayrollVersionHistoryAggregateArgs = {
  args: getPayrollVersionHistoryArgs;
  distinctOn?: InputMaybe<Array<payrollVersionHistoryResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollVersionHistoryResultsOrderBy>>;
  where?: InputMaybe<payrollVersionHistoryResultsBoolExp>;
};


export type query_rootholidayByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type query_rootholidaysArgs = {
  distinctOn?: InputMaybe<Array<holidaysSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<holidaysOrderBy>>;
  where?: InputMaybe<holidaysBoolExp>;
};


export type query_rootholidaysAggregateArgs = {
  distinctOn?: InputMaybe<Array<holidaysSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<holidaysOrderBy>>;
  where?: InputMaybe<holidaysBoolExp>;
};


export type query_rootlatestPayrollVersionResultByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type query_rootlatestPayrollVersionResultsArgs = {
  distinctOn?: InputMaybe<Array<latestPayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<latestPayrollVersionResultsOrderBy>>;
  where?: InputMaybe<latestPayrollVersionResultsBoolExp>;
};


export type query_rootlatestPayrollVersionResultsAggregateArgs = {
  distinctOn?: InputMaybe<Array<latestPayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<latestPayrollVersionResultsOrderBy>>;
  where?: InputMaybe<latestPayrollVersionResultsBoolExp>;
};


export type query_rootleaveArgs = {
  distinctOn?: InputMaybe<Array<leaveSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<leaveOrderBy>>;
  where?: InputMaybe<leaveBoolExp>;
};


export type query_rootleaveAggregateArgs = {
  distinctOn?: InputMaybe<Array<leaveSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<leaveOrderBy>>;
  where?: InputMaybe<leaveBoolExp>;
};


export type query_rootleaveByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type query_rootnoteByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type query_rootnotesArgs = {
  distinctOn?: InputMaybe<Array<notesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<notesOrderBy>>;
  where?: InputMaybe<notesBoolExp>;
};


export type query_rootnotesAggregateArgs = {
  distinctOn?: InputMaybe<Array<notesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<notesOrderBy>>;
  where?: InputMaybe<notesBoolExp>;
};


export type query_rootpayrollActivationResultByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type query_rootpayrollActivationResultsArgs = {
  distinctOn?: InputMaybe<Array<payrollActivationResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollActivationResultsOrderBy>>;
  where?: InputMaybe<payrollActivationResultsBoolExp>;
};


export type query_rootpayrollActivationResultsAggregateArgs = {
  distinctOn?: InputMaybe<Array<payrollActivationResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollActivationResultsOrderBy>>;
  where?: InputMaybe<payrollActivationResultsBoolExp>;
};


export type query_rootpayrollAssignmentAuditByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type query_rootpayrollAssignmentAuditsArgs = {
  distinctOn?: InputMaybe<Array<payrollAssignmentAuditsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollAssignmentAuditsOrderBy>>;
  where?: InputMaybe<payrollAssignmentAuditsBoolExp>;
};


export type query_rootpayrollAssignmentAuditsAggregateArgs = {
  distinctOn?: InputMaybe<Array<payrollAssignmentAuditsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollAssignmentAuditsOrderBy>>;
  where?: InputMaybe<payrollAssignmentAuditsBoolExp>;
};


export type query_rootpayrollAssignmentByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type query_rootpayrollAssignmentsArgs = {
  distinctOn?: InputMaybe<Array<payrollAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollAssignmentsOrderBy>>;
  where?: InputMaybe<payrollAssignmentsBoolExp>;
};


export type query_rootpayrollAssignmentsAggregateArgs = {
  distinctOn?: InputMaybe<Array<payrollAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollAssignmentsOrderBy>>;
  where?: InputMaybe<payrollAssignmentsBoolExp>;
};


export type query_rootpayrollByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type query_rootpayrollCycleByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type query_rootpayrollCyclesArgs = {
  distinctOn?: InputMaybe<Array<payrollCyclesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollCyclesOrderBy>>;
  where?: InputMaybe<payrollCyclesBoolExp>;
};


export type query_rootpayrollCyclesAggregateArgs = {
  distinctOn?: InputMaybe<Array<payrollCyclesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollCyclesOrderBy>>;
  where?: InputMaybe<payrollCyclesBoolExp>;
};


export type query_rootpayrollDashboardStatsArgs = {
  distinctOn?: InputMaybe<Array<payrollDashboardStatsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollDashboardStatsOrderBy>>;
  where?: InputMaybe<payrollDashboardStatsBoolExp>;
};


export type query_rootpayrollDashboardStatsAggregateArgs = {
  distinctOn?: InputMaybe<Array<payrollDashboardStatsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollDashboardStatsOrderBy>>;
  where?: InputMaybe<payrollDashboardStatsBoolExp>;
};


export type query_rootpayrollDateByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type query_rootpayrollDateTypeByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type query_rootpayrollDateTypesArgs = {
  distinctOn?: InputMaybe<Array<payrollDateTypesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollDateTypesOrderBy>>;
  where?: InputMaybe<payrollDateTypesBoolExp>;
};


export type query_rootpayrollDateTypesAggregateArgs = {
  distinctOn?: InputMaybe<Array<payrollDateTypesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollDateTypesOrderBy>>;
  where?: InputMaybe<payrollDateTypesBoolExp>;
};


export type query_rootpayrollDatesArgs = {
  distinctOn?: InputMaybe<Array<payrollDatesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollDatesOrderBy>>;
  where?: InputMaybe<payrollDatesBoolExp>;
};


export type query_rootpayrollDatesAggregateArgs = {
  distinctOn?: InputMaybe<Array<payrollDatesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollDatesOrderBy>>;
  where?: InputMaybe<payrollDatesBoolExp>;
};


export type query_rootpayrollTriggersStatusArgs = {
  distinctOn?: InputMaybe<Array<payrollTriggersStatusSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollTriggersStatusOrderBy>>;
  where?: InputMaybe<payrollTriggersStatusBoolExp>;
};


export type query_rootpayrollTriggersStatusAggregateArgs = {
  distinctOn?: InputMaybe<Array<payrollTriggersStatusSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollTriggersStatusOrderBy>>;
  where?: InputMaybe<payrollTriggersStatusBoolExp>;
};


export type query_rootpayrollVersionHistoryResultByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type query_rootpayrollVersionHistoryResultsArgs = {
  distinctOn?: InputMaybe<Array<payrollVersionHistoryResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollVersionHistoryResultsOrderBy>>;
  where?: InputMaybe<payrollVersionHistoryResultsBoolExp>;
};


export type query_rootpayrollVersionHistoryResultsAggregateArgs = {
  distinctOn?: InputMaybe<Array<payrollVersionHistoryResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollVersionHistoryResultsOrderBy>>;
  where?: InputMaybe<payrollVersionHistoryResultsBoolExp>;
};


export type query_rootpayrollVersionResultByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type query_rootpayrollVersionResultsArgs = {
  distinctOn?: InputMaybe<Array<payrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollVersionResultsOrderBy>>;
  where?: InputMaybe<payrollVersionResultsBoolExp>;
};


export type query_rootpayrollVersionResultsAggregateArgs = {
  distinctOn?: InputMaybe<Array<payrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollVersionResultsOrderBy>>;
  where?: InputMaybe<payrollVersionResultsBoolExp>;
};


export type query_rootpayrollsArgs = {
  distinctOn?: InputMaybe<Array<payrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollsOrderBy>>;
  where?: InputMaybe<payrollsBoolExp>;
};


export type query_rootpayrollsAggregateArgs = {
  distinctOn?: InputMaybe<Array<payrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollsOrderBy>>;
  where?: InputMaybe<payrollsBoolExp>;
};


export type query_rootpermissionAuditLogByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type query_rootpermissionAuditLogsArgs = {
  distinctOn?: InputMaybe<Array<permissionAuditLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<permissionAuditLogsOrderBy>>;
  where?: InputMaybe<permissionAuditLogsBoolExp>;
};


export type query_rootpermissionAuditLogsAggregateArgs = {
  distinctOn?: InputMaybe<Array<permissionAuditLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<permissionAuditLogsOrderBy>>;
  where?: InputMaybe<permissionAuditLogsBoolExp>;
};


export type query_rootpermissionByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type query_rootpermissionChangeByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type query_rootpermissionChangesArgs = {
  distinctOn?: InputMaybe<Array<permissionChangesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<permissionChangesOrderBy>>;
  where?: InputMaybe<permissionChangesBoolExp>;
};


export type query_rootpermissionChangesAggregateArgs = {
  distinctOn?: InputMaybe<Array<permissionChangesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<permissionChangesOrderBy>>;
  where?: InputMaybe<permissionChangesBoolExp>;
};


export type query_rootpermissionOverrideByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type query_rootpermissionOverridesArgs = {
  distinctOn?: InputMaybe<Array<permissionOverridesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<permissionOverridesOrderBy>>;
  where?: InputMaybe<permissionOverridesBoolExp>;
};


export type query_rootpermissionOverridesAggregateArgs = {
  distinctOn?: InputMaybe<Array<permissionOverridesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<permissionOverridesOrderBy>>;
  where?: InputMaybe<permissionOverridesBoolExp>;
};


export type query_rootpermissionUsageReportsArgs = {
  distinctOn?: InputMaybe<Array<permissionUsageReportsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<permissionUsageReportsOrderBy>>;
  where?: InputMaybe<permissionUsageReportsBoolExp>;
};


export type query_rootpermissionUsageReportsAggregateArgs = {
  distinctOn?: InputMaybe<Array<permissionUsageReportsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<permissionUsageReportsOrderBy>>;
  where?: InputMaybe<permissionUsageReportsBoolExp>;
};


export type query_rootpermissionsArgs = {
  distinctOn?: InputMaybe<Array<permissionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<permissionsOrderBy>>;
  where?: InputMaybe<permissionsBoolExp>;
};


export type query_rootpermissionsAggregateArgs = {
  distinctOn?: InputMaybe<Array<permissionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<permissionsOrderBy>>;
  where?: InputMaybe<permissionsBoolExp>;
};


export type query_rootresourceByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type query_rootresourcesArgs = {
  distinctOn?: InputMaybe<Array<resourcesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<resourcesOrderBy>>;
  where?: InputMaybe<resourcesBoolExp>;
};


export type query_rootresourcesAggregateArgs = {
  distinctOn?: InputMaybe<Array<resourcesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<resourcesOrderBy>>;
  where?: InputMaybe<resourcesBoolExp>;
};


export type query_rootroleByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type query_rootrolePermissionByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type query_rootrolePermissionsArgs = {
  distinctOn?: InputMaybe<Array<rolePermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<rolePermissionsOrderBy>>;
  where?: InputMaybe<rolePermissionsBoolExp>;
};


export type query_rootrolePermissionsAggregateArgs = {
  distinctOn?: InputMaybe<Array<rolePermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<rolePermissionsOrderBy>>;
  where?: InputMaybe<rolePermissionsBoolExp>;
};


export type query_rootrolesArgs = {
  distinctOn?: InputMaybe<Array<rolesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<rolesOrderBy>>;
  where?: InputMaybe<rolesBoolExp>;
};


export type query_rootrolesAggregateArgs = {
  distinctOn?: InputMaybe<Array<rolesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<rolesOrderBy>>;
  where?: InputMaybe<rolesBoolExp>;
};


export type query_rootslowQueriesArgs = {
  distinctOn?: InputMaybe<Array<slowQueriesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<slowQueriesOrderBy>>;
  where?: InputMaybe<slowQueriesBoolExp>;
};


export type query_rootslowQueriesAggregateArgs = {
  distinctOn?: InputMaybe<Array<slowQueriesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<slowQueriesOrderBy>>;
  where?: InputMaybe<slowQueriesBoolExp>;
};


export type query_rootslowQueryByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type query_rootuserAccessSummariesArgs = {
  distinctOn?: InputMaybe<Array<userAccessSummariesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<userAccessSummariesOrderBy>>;
  where?: InputMaybe<userAccessSummariesBoolExp>;
};


export type query_rootuserAccessSummariesAggregateArgs = {
  distinctOn?: InputMaybe<Array<userAccessSummariesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<userAccessSummariesOrderBy>>;
  where?: InputMaybe<userAccessSummariesBoolExp>;
};


export type query_rootuserByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type query_rootuserInvitationByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type query_rootuserInvitationsArgs = {
  distinctOn?: InputMaybe<Array<userInvitationsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<userInvitationsOrderBy>>;
  where?: InputMaybe<userInvitationsBoolExp>;
};


export type query_rootuserInvitationsAggregateArgs = {
  distinctOn?: InputMaybe<Array<userInvitationsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<userInvitationsOrderBy>>;
  where?: InputMaybe<userInvitationsBoolExp>;
};


export type query_rootuserRoleByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type query_rootuserRolesArgs = {
  distinctOn?: InputMaybe<Array<userRolesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<userRolesOrderBy>>;
  where?: InputMaybe<userRolesBoolExp>;
};


export type query_rootuserRolesAggregateArgs = {
  distinctOn?: InputMaybe<Array<userRolesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<userRolesOrderBy>>;
  where?: InputMaybe<userRolesBoolExp>;
};


export type query_rootuserSyncByIdArgs = {
  id: Scalars['String']['input'];
};


export type query_rootusersArgs = {
  distinctOn?: InputMaybe<Array<usersSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<usersOrderBy>>;
  where?: InputMaybe<usersBoolExp>;
};


export type query_rootusersAggregateArgs = {
  distinctOn?: InputMaybe<Array<usersSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<usersOrderBy>>;
  where?: InputMaybe<usersBoolExp>;
};


export type query_rootusersRoleBackupsArgs = {
  distinctOn?: InputMaybe<Array<usersRoleBackupSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<usersRoleBackupOrderBy>>;
  where?: InputMaybe<usersRoleBackupBoolExp>;
};


export type query_rootusersRoleBackupsAggregateArgs = {
  distinctOn?: InputMaybe<Array<usersRoleBackupSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<usersRoleBackupOrderBy>>;
  where?: InputMaybe<usersRoleBackupBoolExp>;
};


export type query_rootusersSyncArgs = {
  distinctOn?: InputMaybe<Array<authUsersSyncSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<authUsersSyncOrderBy>>;
  where?: InputMaybe<authUsersSyncBoolExp>;
};


export type query_rootusersSyncAggregateArgs = {
  distinctOn?: InputMaybe<Array<authUsersSyncSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<authUsersSyncOrderBy>>;
  where?: InputMaybe<authUsersSyncBoolExp>;
};


export type query_rootworkScheduleByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type query_rootworkSchedulesArgs = {
  distinctOn?: InputMaybe<Array<workSchedulesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<workSchedulesOrderBy>>;
  where?: InputMaybe<workSchedulesBoolExp>;
};


export type query_rootworkSchedulesAggregateArgs = {
  distinctOn?: InputMaybe<Array<workSchedulesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<workSchedulesOrderBy>>;
  where?: InputMaybe<workSchedulesBoolExp>;
};

/** columns and relationships of "resources" */
export type resources = {
  __typename?: 'resources';
  /** An array relationship */
  availablePermissions: Array<permissions>;
  /** An aggregate relationship */
  availablePermissionsAggregate: permissionsAggregate;
  createdAt: Scalars['timestamptz']['output'];
  description?: Maybe<Scalars['String']['output']>;
  displayName: Scalars['String']['output'];
  id: Scalars['uuid']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['timestamptz']['output'];
};


/** columns and relationships of "resources" */
export type resourcesavailablePermissionsArgs = {
  distinctOn?: InputMaybe<Array<permissionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<permissionsOrderBy>>;
  where?: InputMaybe<permissionsBoolExp>;
};


/** columns and relationships of "resources" */
export type resourcesavailablePermissionsAggregateArgs = {
  distinctOn?: InputMaybe<Array<permissionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<permissionsOrderBy>>;
  where?: InputMaybe<permissionsBoolExp>;
};

/** aggregated selection of "resources" */
export type resourcesAggregate = {
  __typename?: 'resourcesAggregate';
  aggregate?: Maybe<resourcesAggregateFields>;
  nodes: Array<resources>;
};

/** aggregate fields of "resources" */
export type resourcesAggregateFields = {
  __typename?: 'resourcesAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<resourcesMaxFields>;
  min?: Maybe<resourcesMinFields>;
};


/** aggregate fields of "resources" */
export type resourcesAggregateFieldscountArgs = {
  columns?: InputMaybe<Array<resourcesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "resources". All fields are combined with a logical 'AND'. */
export type resourcesBoolExp = {
  _and?: InputMaybe<Array<resourcesBoolExp>>;
  _not?: InputMaybe<resourcesBoolExp>;
  _or?: InputMaybe<Array<resourcesBoolExp>>;
  availablePermissions?: InputMaybe<permissionsBoolExp>;
  availablePermissionsAggregate?: InputMaybe<permissionsAggregateBoolExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  description?: InputMaybe<StringComparisonExp>;
  displayName?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "resources" */
export type resourcesConstraint =
  /** unique or primary key constraint on columns "name" */
  | 'resources_name_key'
  /** unique or primary key constraint on columns "id" */
  | 'resources_pkey';

/** input type for inserting data into table "resources" */
export type resourcesInsertInput = {
  availablePermissions?: InputMaybe<permissionsArrRelInsertInput>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type resourcesMaxFields = {
  __typename?: 'resourcesMaxFields';
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  displayName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type resourcesMinFields = {
  __typename?: 'resourcesMinFields';
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  displayName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "resources" */
export type resourcesMutationResponse = {
  __typename?: 'resourcesMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<resources>;
};

/** input type for inserting object relation for remote table "resources" */
export type resourcesObjRelInsertInput = {
  data: resourcesInsertInput;
  /** upsert condition */
  onConflict?: InputMaybe<resourcesOnConflict>;
};

/** on_conflict condition type for table "resources" */
export type resourcesOnConflict = {
  constraint: resourcesConstraint;
  updateColumns?: Array<resourcesUpdateColumn>;
  where?: InputMaybe<resourcesBoolExp>;
};

/** Ordering options when selecting data from "resources". */
export type resourcesOrderBy = {
  availablePermissionsAggregate?: InputMaybe<permissionsAggregateOrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  displayName?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: resources */
export type resourcesPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "resources" */
export type resourcesSelectColumn =
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
  | 'updatedAt';

/** input type for updating data in table "resources" */
export type resourcesSetInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "resources" */
export type resourcesStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: resourcesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type resourcesStreamCursorValueInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** update columns of table "resources" */
export type resourcesUpdateColumn =
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
  | 'updatedAt';

export type resourcesUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<resourcesSetInput>;
  /** filter the rows which have to be updated */
  where: resourcesBoolExp;
};

/** columns and relationships of "role_permissions" */
export type rolePermissions = {
  __typename?: 'rolePermissions';
  conditions?: Maybe<Scalars['jsonb']['output']>;
  createdAt: Scalars['timestamptz']['output'];
  /** An object relationship */
  grantedPermission: permissions;
  /** An object relationship */
  grantedToRole: roles;
  id: Scalars['uuid']['output'];
  permissionId: Scalars['uuid']['output'];
  roleId: Scalars['uuid']['output'];
  updatedAt: Scalars['timestamptz']['output'];
};


/** columns and relationships of "role_permissions" */
export type rolePermissionsconditionsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "role_permissions" */
export type rolePermissionsAggregate = {
  __typename?: 'rolePermissionsAggregate';
  aggregate?: Maybe<rolePermissionsAggregateFields>;
  nodes: Array<rolePermissions>;
};

export type rolePermissionsAggregateBoolExp = {
  count?: InputMaybe<rolePermissionsAggregateBoolExpCount>;
};

export type rolePermissionsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<rolePermissionsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<rolePermissionsBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "role_permissions" */
export type rolePermissionsAggregateFields = {
  __typename?: 'rolePermissionsAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<rolePermissionsMaxFields>;
  min?: Maybe<rolePermissionsMinFields>;
};


/** aggregate fields of "role_permissions" */
export type rolePermissionsAggregateFieldscountArgs = {
  columns?: InputMaybe<Array<rolePermissionsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "role_permissions" */
export type rolePermissionsAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<rolePermissionsMaxOrderBy>;
  min?: InputMaybe<rolePermissionsMinOrderBy>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type rolePermissionsAppendInput = {
  conditions?: InputMaybe<Scalars['jsonb']['input']>;
};

/** input type for inserting array relation for remote table "role_permissions" */
export type rolePermissionsArrRelInsertInput = {
  data: Array<rolePermissionsInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<rolePermissionsOnConflict>;
};

/** Boolean expression to filter rows from the table "role_permissions". All fields are combined with a logical 'AND'. */
export type rolePermissionsBoolExp = {
  _and?: InputMaybe<Array<rolePermissionsBoolExp>>;
  _not?: InputMaybe<rolePermissionsBoolExp>;
  _or?: InputMaybe<Array<rolePermissionsBoolExp>>;
  conditions?: InputMaybe<JsonbComparisonExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  grantedPermission?: InputMaybe<permissionsBoolExp>;
  grantedToRole?: InputMaybe<rolesBoolExp>;
  id?: InputMaybe<UuidComparisonExp>;
  permissionId?: InputMaybe<UuidComparisonExp>;
  roleId?: InputMaybe<UuidComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "role_permissions" */
export type rolePermissionsConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'role_permissions_pkey'
  /** unique or primary key constraint on columns "permission_id", "role_id" */
  | 'role_permissions_role_id_permission_id_key';

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type rolePermissionsDeleteAtPathInput = {
  conditions?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type rolePermissionsDeleteElemInput = {
  conditions?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type rolePermissionsDeleteKeyInput = {
  conditions?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "role_permissions" */
export type rolePermissionsInsertInput = {
  conditions?: InputMaybe<Scalars['jsonb']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  grantedPermission?: InputMaybe<permissionsObjRelInsertInput>;
  grantedToRole?: InputMaybe<rolesObjRelInsertInput>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  permissionId?: InputMaybe<Scalars['uuid']['input']>;
  roleId?: InputMaybe<Scalars['uuid']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type rolePermissionsMaxFields = {
  __typename?: 'rolePermissionsMaxFields';
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  permissionId?: Maybe<Scalars['uuid']['output']>;
  roleId?: Maybe<Scalars['uuid']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "role_permissions" */
export type rolePermissionsMaxOrderBy = {
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  permissionId?: InputMaybe<OrderBy>;
  roleId?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type rolePermissionsMinFields = {
  __typename?: 'rolePermissionsMinFields';
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  permissionId?: Maybe<Scalars['uuid']['output']>;
  roleId?: Maybe<Scalars['uuid']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "role_permissions" */
export type rolePermissionsMinOrderBy = {
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  permissionId?: InputMaybe<OrderBy>;
  roleId?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "role_permissions" */
export type rolePermissionsMutationResponse = {
  __typename?: 'rolePermissionsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<rolePermissions>;
};

/** on_conflict condition type for table "role_permissions" */
export type rolePermissionsOnConflict = {
  constraint: rolePermissionsConstraint;
  updateColumns?: Array<rolePermissionsUpdateColumn>;
  where?: InputMaybe<rolePermissionsBoolExp>;
};

/** Ordering options when selecting data from "role_permissions". */
export type rolePermissionsOrderBy = {
  conditions?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  grantedPermission?: InputMaybe<permissionsOrderBy>;
  grantedToRole?: InputMaybe<rolesOrderBy>;
  id?: InputMaybe<OrderBy>;
  permissionId?: InputMaybe<OrderBy>;
  roleId?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: role_permissions */
export type rolePermissionsPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type rolePermissionsPrependInput = {
  conditions?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "role_permissions" */
export type rolePermissionsSelectColumn =
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
  | 'updatedAt';

/** input type for updating data in table "role_permissions" */
export type rolePermissionsSetInput = {
  conditions?: InputMaybe<Scalars['jsonb']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  permissionId?: InputMaybe<Scalars['uuid']['input']>;
  roleId?: InputMaybe<Scalars['uuid']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "rolePermissions" */
export type rolePermissionsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: rolePermissionsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type rolePermissionsStreamCursorValueInput = {
  conditions?: InputMaybe<Scalars['jsonb']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  permissionId?: InputMaybe<Scalars['uuid']['input']>;
  roleId?: InputMaybe<Scalars['uuid']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** update columns of table "role_permissions" */
export type rolePermissionsUpdateColumn =
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
  | 'updatedAt';

export type rolePermissionsUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<rolePermissionsAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _deleteAtPath?: InputMaybe<rolePermissionsDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _deleteElem?: InputMaybe<rolePermissionsDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _deleteKey?: InputMaybe<rolePermissionsDeleteKeyInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<rolePermissionsPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<rolePermissionsSetInput>;
  /** filter the rows which have to be updated */
  where: rolePermissionsBoolExp;
};

/** columns and relationships of "roles" */
export type roles = {
  __typename?: 'roles';
  /** An array relationship */
  assignedPermissions: Array<rolePermissions>;
  /** An aggregate relationship */
  assignedPermissionsAggregate: rolePermissionsAggregate;
  /** An array relationship */
  assignedToUsers: Array<userRoles>;
  /** An aggregate relationship */
  assignedToUsersAggregate: userRolesAggregate;
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
export type rolesassignedPermissionsArgs = {
  distinctOn?: InputMaybe<Array<rolePermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<rolePermissionsOrderBy>>;
  where?: InputMaybe<rolePermissionsBoolExp>;
};


/** columns and relationships of "roles" */
export type rolesassignedPermissionsAggregateArgs = {
  distinctOn?: InputMaybe<Array<rolePermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<rolePermissionsOrderBy>>;
  where?: InputMaybe<rolePermissionsBoolExp>;
};


/** columns and relationships of "roles" */
export type rolesassignedToUsersArgs = {
  distinctOn?: InputMaybe<Array<userRolesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<userRolesOrderBy>>;
  where?: InputMaybe<userRolesBoolExp>;
};


/** columns and relationships of "roles" */
export type rolesassignedToUsersAggregateArgs = {
  distinctOn?: InputMaybe<Array<userRolesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<userRolesOrderBy>>;
  where?: InputMaybe<userRolesBoolExp>;
};

/** aggregated selection of "roles" */
export type rolesAggregate = {
  __typename?: 'rolesAggregate';
  aggregate?: Maybe<rolesAggregateFields>;
  nodes: Array<roles>;
};

/** aggregate fields of "roles" */
export type rolesAggregateFields = {
  __typename?: 'rolesAggregateFields';
  avg?: Maybe<rolesAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<rolesMaxFields>;
  min?: Maybe<rolesMinFields>;
  stddev?: Maybe<rolesStddevFields>;
  stddevPop?: Maybe<rolesStddevPopFields>;
  stddevSamp?: Maybe<rolesStddevSampFields>;
  sum?: Maybe<rolesSumFields>;
  varPop?: Maybe<rolesVarPopFields>;
  varSamp?: Maybe<rolesVarSampFields>;
  variance?: Maybe<rolesVarianceFields>;
};


/** aggregate fields of "roles" */
export type rolesAggregateFieldscountArgs = {
  columns?: InputMaybe<Array<rolesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type rolesAvgFields = {
  __typename?: 'rolesAvgFields';
  priority?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "roles". All fields are combined with a logical 'AND'. */
export type rolesBoolExp = {
  _and?: InputMaybe<Array<rolesBoolExp>>;
  _not?: InputMaybe<rolesBoolExp>;
  _or?: InputMaybe<Array<rolesBoolExp>>;
  assignedPermissions?: InputMaybe<rolePermissionsBoolExp>;
  assignedPermissionsAggregate?: InputMaybe<rolePermissionsAggregateBoolExp>;
  assignedToUsers?: InputMaybe<userRolesBoolExp>;
  assignedToUsersAggregate?: InputMaybe<userRolesAggregateBoolExp>;
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
export type rolesConstraint =
  /** unique or primary key constraint on columns "name" */
  | 'roles_name_key'
  /** unique or primary key constraint on columns "id" */
  | 'roles_pkey';

/** input type for incrementing numeric columns in table "roles" */
export type rolesIncInput = {
  priority?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "roles" */
export type rolesInsertInput = {
  assignedPermissions?: InputMaybe<rolePermissionsArrRelInsertInput>;
  assignedToUsers?: InputMaybe<userRolesArrRelInsertInput>;
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
export type rolesMaxFields = {
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
export type rolesMinFields = {
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
export type rolesMutationResponse = {
  __typename?: 'rolesMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<roles>;
};

/** input type for inserting object relation for remote table "roles" */
export type rolesObjRelInsertInput = {
  data: rolesInsertInput;
  /** upsert condition */
  onConflict?: InputMaybe<rolesOnConflict>;
};

/** on_conflict condition type for table "roles" */
export type rolesOnConflict = {
  constraint: rolesConstraint;
  updateColumns?: Array<rolesUpdateColumn>;
  where?: InputMaybe<rolesBoolExp>;
};

/** Ordering options when selecting data from "roles". */
export type rolesOrderBy = {
  assignedPermissionsAggregate?: InputMaybe<rolePermissionsAggregateOrderBy>;
  assignedToUsersAggregate?: InputMaybe<userRolesAggregateOrderBy>;
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
export type rolesPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "roles" */
export type rolesSelectColumn =
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
  | 'updatedAt';

/** input type for updating data in table "roles" */
export type rolesSetInput = {
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
export type rolesStddevFields = {
  __typename?: 'rolesStddevFields';
  priority?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddevPop on columns */
export type rolesStddevPopFields = {
  __typename?: 'rolesStddevPopFields';
  priority?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddevSamp on columns */
export type rolesStddevSampFields = {
  __typename?: 'rolesStddevSampFields';
  priority?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "roles" */
export type rolesStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: rolesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type rolesStreamCursorValueInput = {
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
export type rolesSumFields = {
  __typename?: 'rolesSumFields';
  priority?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "roles" */
export type rolesUpdateColumn =
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
  | 'updatedAt';

export type rolesUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<rolesIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<rolesSetInput>;
  /** filter the rows which have to be updated */
  where: rolesBoolExp;
};

/** aggregate varPop on columns */
export type rolesVarPopFields = {
  __typename?: 'rolesVarPopFields';
  priority?: Maybe<Scalars['Float']['output']>;
};

/** aggregate varSamp on columns */
export type rolesVarSampFields = {
  __typename?: 'rolesVarSampFields';
  priority?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type rolesVarianceFields = {
  __typename?: 'rolesVarianceFields';
  priority?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "audit.slow_queries" */
export type slowQueries = {
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
export type slowQueriesAggregate = {
  __typename?: 'slowQueriesAggregate';
  aggregate?: Maybe<slowQueriesAggregateFields>;
  nodes: Array<slowQueries>;
};

/** aggregate fields of "audit.slow_queries" */
export type slowQueriesAggregateFields = {
  __typename?: 'slowQueriesAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<slowQueriesMaxFields>;
  min?: Maybe<slowQueriesMinFields>;
};


/** aggregate fields of "audit.slow_queries" */
export type slowQueriesAggregateFieldscountArgs = {
  columns?: InputMaybe<Array<slowQueriesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "audit.slow_queries". All fields are combined with a logical 'AND'. */
export type slowQueriesBoolExp = {
  _and?: InputMaybe<Array<slowQueriesBoolExp>>;
  _not?: InputMaybe<slowQueriesBoolExp>;
  _or?: InputMaybe<Array<slowQueriesBoolExp>>;
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
export type slowQueriesConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'slow_queries_pkey';

/** input type for inserting data into table "audit.slow_queries" */
export type slowQueriesInsertInput = {
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
export type slowQueriesMaxFields = {
  __typename?: 'slowQueriesMaxFields';
  applicationName?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  query?: Maybe<Scalars['String']['output']>;
  queryStart?: Maybe<Scalars['timestamptz']['output']>;
  userId?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type slowQueriesMinFields = {
  __typename?: 'slowQueriesMinFields';
  applicationName?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  query?: Maybe<Scalars['String']['output']>;
  queryStart?: Maybe<Scalars['timestamptz']['output']>;
  userId?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "audit.slow_queries" */
export type slowQueriesMutationResponse = {
  __typename?: 'slowQueriesMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<slowQueries>;
};

/** on_conflict condition type for table "audit.slow_queries" */
export type slowQueriesOnConflict = {
  constraint: slowQueriesConstraint;
  updateColumns?: Array<slowQueriesUpdateColumn>;
  where?: InputMaybe<slowQueriesBoolExp>;
};

/** Ordering options when selecting data from "audit.slow_queries". */
export type slowQueriesOrderBy = {
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
export type slowQueriesPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "audit.slow_queries" */
export type slowQueriesSelectColumn =
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
  | 'userId';

/** input type for updating data in table "audit.slow_queries" */
export type slowQueriesSetInput = {
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
export type slowQueriesStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: slowQueriesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type slowQueriesStreamCursorValueInput = {
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
export type slowQueriesUpdateColumn =
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
  | 'userId';

export type slowQueriesUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<slowQueriesSetInput>;
  /** filter the rows which have to be updated */
  where: slowQueriesBoolExp;
};

export type subscription_root = {
  __typename?: 'subscription_root';
  /** execute function "activate_payroll_versions" which returns "payroll_activation_results" */
  activatePayrollVersions: Array<payrollActivationResults>;
  /** execute function "activate_payroll_versions" and query aggregates on result of table type "payroll_activation_results" */
  activatePayrollVersionsAggregate: payrollActivationResultsAggregate;
  /** fetch data from the table: "adjustment_rules" using primary key columns */
  adjustmentRuleById?: Maybe<adjustmentRules>;
  /** An array relationship */
  adjustmentRules: Array<adjustmentRules>;
  /** An aggregate relationship */
  adjustmentRulesAggregate: adjustmentRulesAggregate;
  /** fetch data from the table in a streaming manner: "adjustment_rules" */
  adjustmentRulesStream: Array<adjustmentRules>;
  /** fetch data from the table: "app_settings" using primary key columns */
  appSettingById?: Maybe<appSettings>;
  /** fetch data from the table: "app_settings" */
  appSettings: Array<appSettings>;
  /** fetch aggregated fields from the table: "app_settings" */
  appSettingsAggregate: appSettingsAggregate;
  /** fetch data from the table in a streaming manner: "app_settings" */
  appSettingsStream: Array<appSettings>;
  /** fetch data from the table: "audit.audit_log" using primary key columns */
  auditLogById?: Maybe<auditLogs>;
  /** fetch data from the table: "audit.audit_log" */
  auditLogs: Array<auditLogs>;
  /** fetch aggregated fields from the table: "audit.audit_log" */
  auditLogsAggregate: auditLogsAggregate;
  /** fetch data from the table in a streaming manner: "audit.audit_log" */
  auditLogsStream: Array<auditLogs>;
  /** fetch data from the table: "audit.auth_events" using primary key columns */
  authEventById?: Maybe<authEvents>;
  /** fetch data from the table: "audit.auth_events" */
  authEvents: Array<authEvents>;
  /** fetch aggregated fields from the table: "audit.auth_events" */
  authEventsAggregate: authEventsAggregate;
  /** fetch data from the table in a streaming manner: "audit.auth_events" */
  authEventsStream: Array<authEvents>;
  /** fetch data from the table in a streaming manner: "neon_auth.users_sync" */
  authUsersSyncStream: Array<authUsersSync>;
  /** fetch data from the table: "billing_event_log" using primary key columns */
  billingEventLogById?: Maybe<billingEventLogs>;
  /** An array relationship */
  billingEventLogs: Array<billingEventLogs>;
  /** An aggregate relationship */
  billingEventLogsAggregate: billingEventLogsAggregate;
  /** fetch data from the table in a streaming manner: "billing_event_log" */
  billingEventLogsStream: Array<billingEventLogs>;
  /** fetch data from the table: "billing_invoice" */
  billingInvoice: Array<billingInvoice>;
  /** fetch aggregated fields from the table: "billing_invoice" */
  billingInvoiceAggregate: billingInvoiceAggregate;
  /** fetch data from the table: "billing_invoice" using primary key columns */
  billingInvoiceById?: Maybe<billingInvoice>;
  /** fetch data from the table: "billing_invoice_item" */
  billingInvoiceItem: Array<BillingInvoiceItem>;
  /** fetch aggregated fields from the table: "billing_invoice_item" */
  billingInvoiceItemAggregate: BillingInvoiceItemAggregate;
  /** fetch data from the table: "billing_invoice_item" using primary key columns */
  billingInvoiceItemByPk?: Maybe<BillingInvoiceItem>;
  /** fetch data from the table in a streaming manner: "billing_invoice_item" */
  billingInvoiceItemStream: Array<BillingInvoiceItem>;
  /** fetch data from the table in a streaming manner: "billing_invoice" */
  billingInvoiceStream: Array<billingInvoice>;
  /** fetch data from the table: "billing_items" using primary key columns */
  billingItemById?: Maybe<billingItems>;
  /** An array relationship */
  billingItems: Array<billingItems>;
  /** An aggregate relationship */
  billingItemsAggregate: billingItemsAggregate;
  /** fetch data from the table in a streaming manner: "billing_items" */
  billingItemsStream: Array<billingItems>;
  /** fetch data from the table: "billing_plan" using primary key columns */
  billingPlanById?: Maybe<billingPlans>;
  /** fetch data from the table: "billing_plan" */
  billingPlans: Array<billingPlans>;
  /** fetch aggregated fields from the table: "billing_plan" */
  billingPlansAggregate: billingPlansAggregate;
  /** fetch data from the table in a streaming manner: "billing_plan" */
  billingPlansStream: Array<billingPlans>;
  /** fetch data from the table: "client_billing_assignment" using primary key columns */
  clientBillingAssignmentById?: Maybe<clientBillingAssignments>;
  /** An array relationship */
  clientBillingAssignments: Array<clientBillingAssignments>;
  /** An aggregate relationship */
  clientBillingAssignmentsAggregate: clientBillingAssignmentsAggregate;
  /** fetch data from the table in a streaming manner: "client_billing_assignment" */
  clientBillingAssignmentsStream: Array<clientBillingAssignments>;
  /** fetch data from the table: "clients" using primary key columns */
  clientById?: Maybe<clients>;
  /** fetch data from the table: "client_external_systems" using primary key columns */
  clientExternalSystemById?: Maybe<clientExternalSystems>;
  /** An array relationship */
  clientExternalSystems: Array<clientExternalSystems>;
  /** An aggregate relationship */
  clientExternalSystemsAggregate: clientExternalSystemsAggregate;
  /** fetch data from the table in a streaming manner: "client_external_systems" */
  clientExternalSystemsStream: Array<clientExternalSystems>;
  /** fetch data from the table: "clients" */
  clients: Array<clients>;
  /** fetch aggregated fields from the table: "clients" */
  clientsAggregate: clientsAggregate;
  /** fetch data from the table in a streaming manner: "clients" */
  clientsStream: Array<clients>;
  /** execute function "create_payroll_version" which returns "payroll_version_results" */
  createPayrollVersion: Array<payrollVersionResults>;
  /** execute function "create_payroll_version" and query aggregates on result of table type "payroll_version_results" */
  createPayrollVersionAggregate: payrollVersionResultsAggregate;
  /** execute function "create_payroll_version_simple" which returns "payroll_version_results" */
  createPayrollVersionSimple: Array<payrollVersionResults>;
  /** execute function "create_payroll_version_simple" and query aggregates on result of table type "payroll_version_results" */
  createPayrollVersionSimpleAggregate: payrollVersionResultsAggregate;
  /** fetch data from the table: "current_payrolls" */
  currentPayrolls: Array<currentPayrolls>;
  /** fetch aggregated fields from the table: "current_payrolls" */
  currentPayrollsAggregate: currentPayrollsAggregate;
  /** fetch data from the table in a streaming manner: "current_payrolls" */
  currentPayrollsStream: Array<currentPayrolls>;
  /** fetch data from the table: "audit.data_access_log" using primary key columns */
  dataAccessLogById?: Maybe<dataAccessLogs>;
  /** fetch data from the table: "audit.data_access_log" */
  dataAccessLogs: Array<dataAccessLogs>;
  /** fetch aggregated fields from the table: "audit.data_access_log" */
  dataAccessLogsAggregate: dataAccessLogsAggregate;
  /** fetch data from the table in a streaming manner: "audit.data_access_log" */
  dataAccessLogsStream: Array<dataAccessLogs>;
  /** fetch data from the table: "external_systems" using primary key columns */
  externalSystemById?: Maybe<externalSystems>;
  /** fetch data from the table: "external_systems" */
  externalSystems: Array<externalSystems>;
  /** fetch aggregated fields from the table: "external_systems" */
  externalSystemsAggregate: externalSystemsAggregate;
  /** fetch data from the table in a streaming manner: "external_systems" */
  externalSystemsStream: Array<externalSystems>;
  /** fetch data from the table: "feature_flags" using primary key columns */
  featureFlagById?: Maybe<featureFlags>;
  /** fetch data from the table: "feature_flags" */
  featureFlags: Array<featureFlags>;
  /** fetch aggregated fields from the table: "feature_flags" */
  featureFlagsAggregate: featureFlagsAggregate;
  /** fetch data from the table in a streaming manner: "feature_flags" */
  featureFlagsStream: Array<featureFlags>;
  /** execute function "generate_payroll_dates" which returns "payroll_dates" */
  generatePayrollDates: Array<payrollDates>;
  /** execute function "generate_payroll_dates" and query aggregates on result of table type "payroll_dates" */
  generatePayrollDatesAggregate: payrollDatesAggregate;
  /** execute function "get_latest_payroll_version" which returns "latest_payroll_version_results" */
  getLatestPayrollVersion: Array<latestPayrollVersionResults>;
  /** execute function "get_latest_payroll_version" and query aggregates on result of table type "latest_payroll_version_results" */
  getLatestPayrollVersionAggregate: latestPayrollVersionResultsAggregate;
  /** execute function "get_payroll_version_history" which returns "payroll_version_history_results" */
  getPayrollVersionHistory: Array<payrollVersionHistoryResults>;
  /** execute function "get_payroll_version_history" and query aggregates on result of table type "payroll_version_history_results" */
  getPayrollVersionHistoryAggregate: payrollVersionHistoryResultsAggregate;
  /** fetch data from the table: "holidays" using primary key columns */
  holidayById?: Maybe<holidays>;
  /** fetch data from the table: "holidays" */
  holidays: Array<holidays>;
  /** fetch aggregated fields from the table: "holidays" */
  holidaysAggregate: holidaysAggregate;
  /** fetch data from the table in a streaming manner: "holidays" */
  holidaysStream: Array<holidays>;
  /** fetch data from the table: "latest_payroll_version_results" using primary key columns */
  latestPayrollVersionResultById?: Maybe<latestPayrollVersionResults>;
  /** fetch data from the table: "latest_payroll_version_results" */
  latestPayrollVersionResults: Array<latestPayrollVersionResults>;
  /** fetch aggregated fields from the table: "latest_payroll_version_results" */
  latestPayrollVersionResultsAggregate: latestPayrollVersionResultsAggregate;
  /** fetch data from the table in a streaming manner: "latest_payroll_version_results" */
  latestPayrollVersionResultsStream: Array<latestPayrollVersionResults>;
  /** fetch data from the table: "leave" */
  leave: Array<leave>;
  /** fetch aggregated fields from the table: "leave" */
  leaveAggregate: leaveAggregate;
  /** fetch data from the table: "leave" using primary key columns */
  leaveById?: Maybe<leave>;
  /** fetch data from the table in a streaming manner: "leave" */
  leaveStream: Array<leave>;
  /** fetch data from the table: "notes" using primary key columns */
  noteById?: Maybe<notes>;
  /** fetch data from the table: "notes" */
  notes: Array<notes>;
  /** fetch aggregated fields from the table: "notes" */
  notesAggregate: notesAggregate;
  /** fetch data from the table in a streaming manner: "notes" */
  notesStream: Array<notes>;
  /** fetch data from the table: "payroll_activation_results" using primary key columns */
  payrollActivationResultById?: Maybe<payrollActivationResults>;
  /** fetch data from the table: "payroll_activation_results" */
  payrollActivationResults: Array<payrollActivationResults>;
  /** fetch aggregated fields from the table: "payroll_activation_results" */
  payrollActivationResultsAggregate: payrollActivationResultsAggregate;
  /** fetch data from the table in a streaming manner: "payroll_activation_results" */
  payrollActivationResultsStream: Array<payrollActivationResults>;
  /** fetch data from the table: "payroll_assignment_audit" using primary key columns */
  payrollAssignmentAuditById?: Maybe<payrollAssignmentAudits>;
  /** An array relationship */
  payrollAssignmentAudits: Array<payrollAssignmentAudits>;
  /** An aggregate relationship */
  payrollAssignmentAuditsAggregate: payrollAssignmentAuditsAggregate;
  /** fetch data from the table in a streaming manner: "payroll_assignment_audit" */
  payrollAssignmentAuditsStream: Array<payrollAssignmentAudits>;
  /** fetch data from the table: "payroll_assignments" using primary key columns */
  payrollAssignmentById?: Maybe<payrollAssignments>;
  /** fetch data from the table: "payroll_assignments" */
  payrollAssignments: Array<payrollAssignments>;
  /** fetch aggregated fields from the table: "payroll_assignments" */
  payrollAssignmentsAggregate: payrollAssignmentsAggregate;
  /** fetch data from the table in a streaming manner: "payroll_assignments" */
  payrollAssignmentsStream: Array<payrollAssignments>;
  /** fetch data from the table: "payrolls" using primary key columns */
  payrollById?: Maybe<payrolls>;
  /** fetch data from the table: "payroll_cycles" using primary key columns */
  payrollCycleById?: Maybe<payrollCycles>;
  /** fetch data from the table: "payroll_cycles" */
  payrollCycles: Array<payrollCycles>;
  /** fetch aggregated fields from the table: "payroll_cycles" */
  payrollCyclesAggregate: payrollCyclesAggregate;
  /** fetch data from the table in a streaming manner: "payroll_cycles" */
  payrollCyclesStream: Array<payrollCycles>;
  /** fetch data from the table: "payroll_dashboard_stats" */
  payrollDashboardStats: Array<payrollDashboardStats>;
  /** fetch aggregated fields from the table: "payroll_dashboard_stats" */
  payrollDashboardStatsAggregate: payrollDashboardStatsAggregate;
  /** fetch data from the table in a streaming manner: "payroll_dashboard_stats" */
  payrollDashboardStatsStream: Array<payrollDashboardStats>;
  /** fetch data from the table: "payroll_dates" using primary key columns */
  payrollDateById?: Maybe<payrollDates>;
  /** fetch data from the table: "payroll_date_types" using primary key columns */
  payrollDateTypeById?: Maybe<payrollDateTypes>;
  /** fetch data from the table: "payroll_date_types" */
  payrollDateTypes: Array<payrollDateTypes>;
  /** fetch aggregated fields from the table: "payroll_date_types" */
  payrollDateTypesAggregate: payrollDateTypesAggregate;
  /** fetch data from the table in a streaming manner: "payroll_date_types" */
  payrollDateTypesStream: Array<payrollDateTypes>;
  /** An array relationship */
  payrollDates: Array<payrollDates>;
  /** An aggregate relationship */
  payrollDatesAggregate: payrollDatesAggregate;
  /** fetch data from the table in a streaming manner: "payroll_dates" */
  payrollDatesStream: Array<payrollDates>;
  /** fetch data from the table: "payroll_triggers_status" */
  payrollTriggersStatus: Array<payrollTriggersStatus>;
  /** fetch aggregated fields from the table: "payroll_triggers_status" */
  payrollTriggersStatusAggregate: payrollTriggersStatusAggregate;
  /** fetch data from the table in a streaming manner: "payroll_triggers_status" */
  payrollTriggersStatusStream: Array<payrollTriggersStatus>;
  /** fetch data from the table: "payroll_version_history_results" using primary key columns */
  payrollVersionHistoryResultById?: Maybe<payrollVersionHistoryResults>;
  /** fetch data from the table: "payroll_version_history_results" */
  payrollVersionHistoryResults: Array<payrollVersionHistoryResults>;
  /** fetch aggregated fields from the table: "payroll_version_history_results" */
  payrollVersionHistoryResultsAggregate: payrollVersionHistoryResultsAggregate;
  /** fetch data from the table in a streaming manner: "payroll_version_history_results" */
  payrollVersionHistoryResultsStream: Array<payrollVersionHistoryResults>;
  /** fetch data from the table: "payroll_version_results" using primary key columns */
  payrollVersionResultById?: Maybe<payrollVersionResults>;
  /** fetch data from the table: "payroll_version_results" */
  payrollVersionResults: Array<payrollVersionResults>;
  /** fetch aggregated fields from the table: "payroll_version_results" */
  payrollVersionResultsAggregate: payrollVersionResultsAggregate;
  /** fetch data from the table in a streaming manner: "payroll_version_results" */
  payrollVersionResultsStream: Array<payrollVersionResults>;
  /** An array relationship */
  payrolls: Array<payrolls>;
  /** An aggregate relationship */
  payrollsAggregate: payrollsAggregate;
  /** fetch data from the table in a streaming manner: "payrolls" */
  payrollsStream: Array<payrolls>;
  /** fetch data from the table: "permission_audit_log" using primary key columns */
  permissionAuditLogById?: Maybe<permissionAuditLogs>;
  /** fetch data from the table: "permission_audit_log" */
  permissionAuditLogs: Array<permissionAuditLogs>;
  /** fetch aggregated fields from the table: "permission_audit_log" */
  permissionAuditLogsAggregate: permissionAuditLogsAggregate;
  /** fetch data from the table in a streaming manner: "permission_audit_log" */
  permissionAuditLogsStream: Array<permissionAuditLogs>;
  /** fetch data from the table: "permissions" using primary key columns */
  permissionById?: Maybe<permissions>;
  /** fetch data from the table: "audit.permission_changes" using primary key columns */
  permissionChangeById?: Maybe<permissionChanges>;
  /** fetch data from the table: "audit.permission_changes" */
  permissionChanges: Array<permissionChanges>;
  /** fetch aggregated fields from the table: "audit.permission_changes" */
  permissionChangesAggregate: permissionChangesAggregate;
  /** fetch data from the table in a streaming manner: "audit.permission_changes" */
  permissionChangesStream: Array<permissionChanges>;
  /** fetch data from the table: "permission_overrides" using primary key columns */
  permissionOverrideById?: Maybe<permissionOverrides>;
  /** fetch data from the table: "permission_overrides" */
  permissionOverrides: Array<permissionOverrides>;
  /** fetch aggregated fields from the table: "permission_overrides" */
  permissionOverridesAggregate: permissionOverridesAggregate;
  /** fetch data from the table in a streaming manner: "permission_overrides" */
  permissionOverridesStream: Array<permissionOverrides>;
  /** fetch data from the table: "audit.permission_usage_report" */
  permissionUsageReports: Array<permissionUsageReports>;
  /** fetch aggregated fields from the table: "audit.permission_usage_report" */
  permissionUsageReportsAggregate: permissionUsageReportsAggregate;
  /** fetch data from the table in a streaming manner: "audit.permission_usage_report" */
  permissionUsageReportsStream: Array<permissionUsageReports>;
  /** fetch data from the table: "permissions" */
  permissions: Array<permissions>;
  /** fetch aggregated fields from the table: "permissions" */
  permissionsAggregate: permissionsAggregate;
  /** fetch data from the table in a streaming manner: "permissions" */
  permissionsStream: Array<permissions>;
  /** fetch data from the table: "resources" using primary key columns */
  resourceById?: Maybe<resources>;
  /** fetch data from the table: "resources" */
  resources: Array<resources>;
  /** fetch aggregated fields from the table: "resources" */
  resourcesAggregate: resourcesAggregate;
  /** fetch data from the table in a streaming manner: "resources" */
  resourcesStream: Array<resources>;
  /** fetch data from the table: "roles" using primary key columns */
  roleById?: Maybe<roles>;
  /** fetch data from the table: "role_permissions" using primary key columns */
  rolePermissionById?: Maybe<rolePermissions>;
  /** fetch data from the table: "role_permissions" */
  rolePermissions: Array<rolePermissions>;
  /** fetch aggregated fields from the table: "role_permissions" */
  rolePermissionsAggregate: rolePermissionsAggregate;
  /** fetch data from the table in a streaming manner: "role_permissions" */
  rolePermissionsStream: Array<rolePermissions>;
  /** fetch data from the table: "roles" */
  roles: Array<roles>;
  /** fetch aggregated fields from the table: "roles" */
  rolesAggregate: rolesAggregate;
  /** fetch data from the table in a streaming manner: "roles" */
  rolesStream: Array<roles>;
  /** fetch data from the table: "audit.slow_queries" */
  slowQueries: Array<slowQueries>;
  /** fetch aggregated fields from the table: "audit.slow_queries" */
  slowQueriesAggregate: slowQueriesAggregate;
  /** fetch data from the table in a streaming manner: "audit.slow_queries" */
  slowQueriesStream: Array<slowQueries>;
  /** fetch data from the table: "audit.slow_queries" using primary key columns */
  slowQueryById?: Maybe<slowQueries>;
  /** fetch data from the table: "audit.user_access_summary" */
  userAccessSummaries: Array<userAccessSummaries>;
  /** fetch aggregated fields from the table: "audit.user_access_summary" */
  userAccessSummariesAggregate: userAccessSummariesAggregate;
  /** fetch data from the table in a streaming manner: "audit.user_access_summary" */
  userAccessSummariesStream: Array<userAccessSummaries>;
  /** fetch data from the table: "users" using primary key columns */
  userById?: Maybe<users>;
  /** fetch data from the table: "user_invitations" using primary key columns */
  userInvitationById?: Maybe<userInvitations>;
  /** fetch data from the table: "user_invitations" */
  userInvitations: Array<userInvitations>;
  /** fetch aggregated fields from the table: "user_invitations" */
  userInvitationsAggregate: userInvitationsAggregate;
  /** fetch data from the table in a streaming manner: "user_invitations" */
  userInvitationsStream: Array<userInvitations>;
  /** fetch data from the table: "user_roles" using primary key columns */
  userRoleById?: Maybe<userRoles>;
  /** fetch data from the table: "user_roles" */
  userRoles: Array<userRoles>;
  /** fetch aggregated fields from the table: "user_roles" */
  userRolesAggregate: userRolesAggregate;
  /** fetch data from the table in a streaming manner: "user_roles" */
  userRolesStream: Array<userRoles>;
  /** fetch data from the table: "neon_auth.users_sync" using primary key columns */
  userSyncById?: Maybe<authUsersSync>;
  /** fetch data from the table: "users" */
  users: Array<users>;
  /** fetch aggregated fields from the table: "users" */
  usersAggregate: usersAggregate;
  /** fetch data from the table in a streaming manner: "users_role_backup" */
  usersRoleBackupStream: Array<usersRoleBackup>;
  /** fetch data from the table: "users_role_backup" */
  usersRoleBackups: Array<usersRoleBackup>;
  /** fetch aggregated fields from the table: "users_role_backup" */
  usersRoleBackupsAggregate: usersRoleBackupAggregate;
  /** fetch data from the table in a streaming manner: "users" */
  usersStream: Array<users>;
  /** fetch data from the table: "neon_auth.users_sync" */
  usersSync: Array<authUsersSync>;
  /** fetch aggregated fields from the table: "neon_auth.users_sync" */
  usersSyncAggregate: authUsersSyncAggregate;
  /** fetch data from the table: "work_schedule" using primary key columns */
  workScheduleById?: Maybe<workSchedules>;
  /** fetch data from the table: "work_schedule" */
  workSchedules: Array<workSchedules>;
  /** fetch aggregated fields from the table: "work_schedule" */
  workSchedulesAggregate: workSchedulesAggregate;
  /** fetch data from the table in a streaming manner: "work_schedule" */
  workSchedulesStream: Array<workSchedules>;
};


export type subscription_rootactivatePayrollVersionsArgs = {
  distinctOn?: InputMaybe<Array<payrollActivationResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollActivationResultsOrderBy>>;
  where?: InputMaybe<payrollActivationResultsBoolExp>;
};


export type subscription_rootactivatePayrollVersionsAggregateArgs = {
  distinctOn?: InputMaybe<Array<payrollActivationResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollActivationResultsOrderBy>>;
  where?: InputMaybe<payrollActivationResultsBoolExp>;
};


export type subscription_rootadjustmentRuleByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type subscription_rootadjustmentRulesArgs = {
  distinctOn?: InputMaybe<Array<adjustmentRulesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<adjustmentRulesOrderBy>>;
  where?: InputMaybe<adjustmentRulesBoolExp>;
};


export type subscription_rootadjustmentRulesAggregateArgs = {
  distinctOn?: InputMaybe<Array<adjustmentRulesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<adjustmentRulesOrderBy>>;
  where?: InputMaybe<adjustmentRulesBoolExp>;
};


export type subscription_rootadjustmentRulesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<adjustmentRulesStreamCursorInput>>;
  where?: InputMaybe<adjustmentRulesBoolExp>;
};


export type subscription_rootappSettingByIdArgs = {
  id: Scalars['String']['input'];
};


export type subscription_rootappSettingsArgs = {
  distinctOn?: InputMaybe<Array<appSettingsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<appSettingsOrderBy>>;
  where?: InputMaybe<appSettingsBoolExp>;
};


export type subscription_rootappSettingsAggregateArgs = {
  distinctOn?: InputMaybe<Array<appSettingsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<appSettingsOrderBy>>;
  where?: InputMaybe<appSettingsBoolExp>;
};


export type subscription_rootappSettingsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<appSettingsStreamCursorInput>>;
  where?: InputMaybe<appSettingsBoolExp>;
};


export type subscription_rootauditLogByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type subscription_rootauditLogsArgs = {
  distinctOn?: InputMaybe<Array<auditLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<auditLogsOrderBy>>;
  where?: InputMaybe<auditLogsBoolExp>;
};


export type subscription_rootauditLogsAggregateArgs = {
  distinctOn?: InputMaybe<Array<auditLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<auditLogsOrderBy>>;
  where?: InputMaybe<auditLogsBoolExp>;
};


export type subscription_rootauditLogsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<auditLogsStreamCursorInput>>;
  where?: InputMaybe<auditLogsBoolExp>;
};


export type subscription_rootauthEventByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type subscription_rootauthEventsArgs = {
  distinctOn?: InputMaybe<Array<authEventsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<authEventsOrderBy>>;
  where?: InputMaybe<authEventsBoolExp>;
};


export type subscription_rootauthEventsAggregateArgs = {
  distinctOn?: InputMaybe<Array<authEventsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<authEventsOrderBy>>;
  where?: InputMaybe<authEventsBoolExp>;
};


export type subscription_rootauthEventsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<authEventsStreamCursorInput>>;
  where?: InputMaybe<authEventsBoolExp>;
};


export type subscription_rootauthUsersSyncStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<authUsersSyncStreamCursorInput>>;
  where?: InputMaybe<authUsersSyncBoolExp>;
};


export type subscription_rootbillingEventLogByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type subscription_rootbillingEventLogsArgs = {
  distinctOn?: InputMaybe<Array<billingEventLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<billingEventLogsOrderBy>>;
  where?: InputMaybe<billingEventLogsBoolExp>;
};


export type subscription_rootbillingEventLogsAggregateArgs = {
  distinctOn?: InputMaybe<Array<billingEventLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<billingEventLogsOrderBy>>;
  where?: InputMaybe<billingEventLogsBoolExp>;
};


export type subscription_rootbillingEventLogsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<billingEventLogsStreamCursorInput>>;
  where?: InputMaybe<billingEventLogsBoolExp>;
};


export type subscription_rootbillingInvoiceArgs = {
  distinctOn?: InputMaybe<Array<billingInvoiceSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<billingInvoiceOrderBy>>;
  where?: InputMaybe<billingInvoiceBoolExp>;
};


export type subscription_rootbillingInvoiceAggregateArgs = {
  distinctOn?: InputMaybe<Array<billingInvoiceSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<billingInvoiceOrderBy>>;
  where?: InputMaybe<billingInvoiceBoolExp>;
};


export type subscription_rootbillingInvoiceByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type subscription_rootbillingInvoiceItemArgs = {
  distinctOn?: InputMaybe<Array<BillingInvoiceItemSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BillingInvoiceItemOrderBy>>;
  where?: InputMaybe<BillingInvoiceItemBoolExp>;
};


export type subscription_rootbillingInvoiceItemAggregateArgs = {
  distinctOn?: InputMaybe<Array<BillingInvoiceItemSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BillingInvoiceItemOrderBy>>;
  where?: InputMaybe<BillingInvoiceItemBoolExp>;
};


export type subscription_rootbillingInvoiceItemByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type subscription_rootbillingInvoiceItemStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<BillingInvoiceItemStreamCursorInput>>;
  where?: InputMaybe<BillingInvoiceItemBoolExp>;
};


export type subscription_rootbillingInvoiceStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<billingInvoiceStreamCursorInput>>;
  where?: InputMaybe<billingInvoiceBoolExp>;
};


export type subscription_rootbillingItemByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type subscription_rootbillingItemsArgs = {
  distinctOn?: InputMaybe<Array<billingItemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<billingItemsOrderBy>>;
  where?: InputMaybe<billingItemsBoolExp>;
};


export type subscription_rootbillingItemsAggregateArgs = {
  distinctOn?: InputMaybe<Array<billingItemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<billingItemsOrderBy>>;
  where?: InputMaybe<billingItemsBoolExp>;
};


export type subscription_rootbillingItemsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<billingItemsStreamCursorInput>>;
  where?: InputMaybe<billingItemsBoolExp>;
};


export type subscription_rootbillingPlanByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type subscription_rootbillingPlansArgs = {
  distinctOn?: InputMaybe<Array<billingPlansSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<billingPlansOrderBy>>;
  where?: InputMaybe<billingPlansBoolExp>;
};


export type subscription_rootbillingPlansAggregateArgs = {
  distinctOn?: InputMaybe<Array<billingPlansSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<billingPlansOrderBy>>;
  where?: InputMaybe<billingPlansBoolExp>;
};


export type subscription_rootbillingPlansStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<billingPlansStreamCursorInput>>;
  where?: InputMaybe<billingPlansBoolExp>;
};


export type subscription_rootclientBillingAssignmentByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type subscription_rootclientBillingAssignmentsArgs = {
  distinctOn?: InputMaybe<Array<clientBillingAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<clientBillingAssignmentsOrderBy>>;
  where?: InputMaybe<clientBillingAssignmentsBoolExp>;
};


export type subscription_rootclientBillingAssignmentsAggregateArgs = {
  distinctOn?: InputMaybe<Array<clientBillingAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<clientBillingAssignmentsOrderBy>>;
  where?: InputMaybe<clientBillingAssignmentsBoolExp>;
};


export type subscription_rootclientBillingAssignmentsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<clientBillingAssignmentsStreamCursorInput>>;
  where?: InputMaybe<clientBillingAssignmentsBoolExp>;
};


export type subscription_rootclientByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type subscription_rootclientExternalSystemByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type subscription_rootclientExternalSystemsArgs = {
  distinctOn?: InputMaybe<Array<clientExternalSystemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<clientExternalSystemsOrderBy>>;
  where?: InputMaybe<clientExternalSystemsBoolExp>;
};


export type subscription_rootclientExternalSystemsAggregateArgs = {
  distinctOn?: InputMaybe<Array<clientExternalSystemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<clientExternalSystemsOrderBy>>;
  where?: InputMaybe<clientExternalSystemsBoolExp>;
};


export type subscription_rootclientExternalSystemsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<clientExternalSystemsStreamCursorInput>>;
  where?: InputMaybe<clientExternalSystemsBoolExp>;
};


export type subscription_rootclientsArgs = {
  distinctOn?: InputMaybe<Array<clientsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<clientsOrderBy>>;
  where?: InputMaybe<clientsBoolExp>;
};


export type subscription_rootclientsAggregateArgs = {
  distinctOn?: InputMaybe<Array<clientsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<clientsOrderBy>>;
  where?: InputMaybe<clientsBoolExp>;
};


export type subscription_rootclientsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<clientsStreamCursorInput>>;
  where?: InputMaybe<clientsBoolExp>;
};


export type subscription_rootcreatePayrollVersionArgs = {
  args: createPayrollVersionArgs;
  distinctOn?: InputMaybe<Array<payrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollVersionResultsOrderBy>>;
  where?: InputMaybe<payrollVersionResultsBoolExp>;
};


export type subscription_rootcreatePayrollVersionAggregateArgs = {
  args: createPayrollVersionArgs;
  distinctOn?: InputMaybe<Array<payrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollVersionResultsOrderBy>>;
  where?: InputMaybe<payrollVersionResultsBoolExp>;
};


export type subscription_rootcreatePayrollVersionSimpleArgs = {
  args: createPayrollVersionSimpleArgs;
  distinctOn?: InputMaybe<Array<payrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollVersionResultsOrderBy>>;
  where?: InputMaybe<payrollVersionResultsBoolExp>;
};


export type subscription_rootcreatePayrollVersionSimpleAggregateArgs = {
  args: createPayrollVersionSimpleArgs;
  distinctOn?: InputMaybe<Array<payrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollVersionResultsOrderBy>>;
  where?: InputMaybe<payrollVersionResultsBoolExp>;
};


export type subscription_rootcurrentPayrollsArgs = {
  distinctOn?: InputMaybe<Array<currentPayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<currentPayrollsOrderBy>>;
  where?: InputMaybe<currentPayrollsBoolExp>;
};


export type subscription_rootcurrentPayrollsAggregateArgs = {
  distinctOn?: InputMaybe<Array<currentPayrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<currentPayrollsOrderBy>>;
  where?: InputMaybe<currentPayrollsBoolExp>;
};


export type subscription_rootcurrentPayrollsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<currentPayrollsStreamCursorInput>>;
  where?: InputMaybe<currentPayrollsBoolExp>;
};


export type subscription_rootdataAccessLogByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type subscription_rootdataAccessLogsArgs = {
  distinctOn?: InputMaybe<Array<dataAccessLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<dataAccessLogsOrderBy>>;
  where?: InputMaybe<dataAccessLogsBoolExp>;
};


export type subscription_rootdataAccessLogsAggregateArgs = {
  distinctOn?: InputMaybe<Array<dataAccessLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<dataAccessLogsOrderBy>>;
  where?: InputMaybe<dataAccessLogsBoolExp>;
};


export type subscription_rootdataAccessLogsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<dataAccessLogsStreamCursorInput>>;
  where?: InputMaybe<dataAccessLogsBoolExp>;
};


export type subscription_rootexternalSystemByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type subscription_rootexternalSystemsArgs = {
  distinctOn?: InputMaybe<Array<externalSystemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<externalSystemsOrderBy>>;
  where?: InputMaybe<externalSystemsBoolExp>;
};


export type subscription_rootexternalSystemsAggregateArgs = {
  distinctOn?: InputMaybe<Array<externalSystemsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<externalSystemsOrderBy>>;
  where?: InputMaybe<externalSystemsBoolExp>;
};


export type subscription_rootexternalSystemsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<externalSystemsStreamCursorInput>>;
  where?: InputMaybe<externalSystemsBoolExp>;
};


export type subscription_rootfeatureFlagByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type subscription_rootfeatureFlagsArgs = {
  distinctOn?: InputMaybe<Array<featureFlagsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<featureFlagsOrderBy>>;
  where?: InputMaybe<featureFlagsBoolExp>;
};


export type subscription_rootfeatureFlagsAggregateArgs = {
  distinctOn?: InputMaybe<Array<featureFlagsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<featureFlagsOrderBy>>;
  where?: InputMaybe<featureFlagsBoolExp>;
};


export type subscription_rootfeatureFlagsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<featureFlagsStreamCursorInput>>;
  where?: InputMaybe<featureFlagsBoolExp>;
};


export type subscription_rootgeneratePayrollDatesArgs = {
  args: generatePayrollDatesArgs;
  distinctOn?: InputMaybe<Array<payrollDatesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollDatesOrderBy>>;
  where?: InputMaybe<payrollDatesBoolExp>;
};


export type subscription_rootgeneratePayrollDatesAggregateArgs = {
  args: generatePayrollDatesArgs;
  distinctOn?: InputMaybe<Array<payrollDatesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollDatesOrderBy>>;
  where?: InputMaybe<payrollDatesBoolExp>;
};


export type subscription_rootgetLatestPayrollVersionArgs = {
  args: getLatestPayrollVersionArgs;
  distinctOn?: InputMaybe<Array<latestPayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<latestPayrollVersionResultsOrderBy>>;
  where?: InputMaybe<latestPayrollVersionResultsBoolExp>;
};


export type subscription_rootgetLatestPayrollVersionAggregateArgs = {
  args: getLatestPayrollVersionArgs;
  distinctOn?: InputMaybe<Array<latestPayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<latestPayrollVersionResultsOrderBy>>;
  where?: InputMaybe<latestPayrollVersionResultsBoolExp>;
};


export type subscription_rootgetPayrollVersionHistoryArgs = {
  args: getPayrollVersionHistoryArgs;
  distinctOn?: InputMaybe<Array<payrollVersionHistoryResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollVersionHistoryResultsOrderBy>>;
  where?: InputMaybe<payrollVersionHistoryResultsBoolExp>;
};


export type subscription_rootgetPayrollVersionHistoryAggregateArgs = {
  args: getPayrollVersionHistoryArgs;
  distinctOn?: InputMaybe<Array<payrollVersionHistoryResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollVersionHistoryResultsOrderBy>>;
  where?: InputMaybe<payrollVersionHistoryResultsBoolExp>;
};


export type subscription_rootholidayByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type subscription_rootholidaysArgs = {
  distinctOn?: InputMaybe<Array<holidaysSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<holidaysOrderBy>>;
  where?: InputMaybe<holidaysBoolExp>;
};


export type subscription_rootholidaysAggregateArgs = {
  distinctOn?: InputMaybe<Array<holidaysSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<holidaysOrderBy>>;
  where?: InputMaybe<holidaysBoolExp>;
};


export type subscription_rootholidaysStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<holidaysStreamCursorInput>>;
  where?: InputMaybe<holidaysBoolExp>;
};


export type subscription_rootlatestPayrollVersionResultByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type subscription_rootlatestPayrollVersionResultsArgs = {
  distinctOn?: InputMaybe<Array<latestPayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<latestPayrollVersionResultsOrderBy>>;
  where?: InputMaybe<latestPayrollVersionResultsBoolExp>;
};


export type subscription_rootlatestPayrollVersionResultsAggregateArgs = {
  distinctOn?: InputMaybe<Array<latestPayrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<latestPayrollVersionResultsOrderBy>>;
  where?: InputMaybe<latestPayrollVersionResultsBoolExp>;
};


export type subscription_rootlatestPayrollVersionResultsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<latestPayrollVersionResultsStreamCursorInput>>;
  where?: InputMaybe<latestPayrollVersionResultsBoolExp>;
};


export type subscription_rootleaveArgs = {
  distinctOn?: InputMaybe<Array<leaveSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<leaveOrderBy>>;
  where?: InputMaybe<leaveBoolExp>;
};


export type subscription_rootleaveAggregateArgs = {
  distinctOn?: InputMaybe<Array<leaveSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<leaveOrderBy>>;
  where?: InputMaybe<leaveBoolExp>;
};


export type subscription_rootleaveByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type subscription_rootleaveStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<leaveStreamCursorInput>>;
  where?: InputMaybe<leaveBoolExp>;
};


export type subscription_rootnoteByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type subscription_rootnotesArgs = {
  distinctOn?: InputMaybe<Array<notesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<notesOrderBy>>;
  where?: InputMaybe<notesBoolExp>;
};


export type subscription_rootnotesAggregateArgs = {
  distinctOn?: InputMaybe<Array<notesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<notesOrderBy>>;
  where?: InputMaybe<notesBoolExp>;
};


export type subscription_rootnotesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<notesStreamCursorInput>>;
  where?: InputMaybe<notesBoolExp>;
};


export type subscription_rootpayrollActivationResultByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type subscription_rootpayrollActivationResultsArgs = {
  distinctOn?: InputMaybe<Array<payrollActivationResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollActivationResultsOrderBy>>;
  where?: InputMaybe<payrollActivationResultsBoolExp>;
};


export type subscription_rootpayrollActivationResultsAggregateArgs = {
  distinctOn?: InputMaybe<Array<payrollActivationResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollActivationResultsOrderBy>>;
  where?: InputMaybe<payrollActivationResultsBoolExp>;
};


export type subscription_rootpayrollActivationResultsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<payrollActivationResultsStreamCursorInput>>;
  where?: InputMaybe<payrollActivationResultsBoolExp>;
};


export type subscription_rootpayrollAssignmentAuditByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type subscription_rootpayrollAssignmentAuditsArgs = {
  distinctOn?: InputMaybe<Array<payrollAssignmentAuditsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollAssignmentAuditsOrderBy>>;
  where?: InputMaybe<payrollAssignmentAuditsBoolExp>;
};


export type subscription_rootpayrollAssignmentAuditsAggregateArgs = {
  distinctOn?: InputMaybe<Array<payrollAssignmentAuditsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollAssignmentAuditsOrderBy>>;
  where?: InputMaybe<payrollAssignmentAuditsBoolExp>;
};


export type subscription_rootpayrollAssignmentAuditsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<payrollAssignmentAuditsStreamCursorInput>>;
  where?: InputMaybe<payrollAssignmentAuditsBoolExp>;
};


export type subscription_rootpayrollAssignmentByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type subscription_rootpayrollAssignmentsArgs = {
  distinctOn?: InputMaybe<Array<payrollAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollAssignmentsOrderBy>>;
  where?: InputMaybe<payrollAssignmentsBoolExp>;
};


export type subscription_rootpayrollAssignmentsAggregateArgs = {
  distinctOn?: InputMaybe<Array<payrollAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollAssignmentsOrderBy>>;
  where?: InputMaybe<payrollAssignmentsBoolExp>;
};


export type subscription_rootpayrollAssignmentsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<payrollAssignmentsStreamCursorInput>>;
  where?: InputMaybe<payrollAssignmentsBoolExp>;
};


export type subscription_rootpayrollByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type subscription_rootpayrollCycleByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type subscription_rootpayrollCyclesArgs = {
  distinctOn?: InputMaybe<Array<payrollCyclesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollCyclesOrderBy>>;
  where?: InputMaybe<payrollCyclesBoolExp>;
};


export type subscription_rootpayrollCyclesAggregateArgs = {
  distinctOn?: InputMaybe<Array<payrollCyclesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollCyclesOrderBy>>;
  where?: InputMaybe<payrollCyclesBoolExp>;
};


export type subscription_rootpayrollCyclesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<payrollCyclesStreamCursorInput>>;
  where?: InputMaybe<payrollCyclesBoolExp>;
};


export type subscription_rootpayrollDashboardStatsArgs = {
  distinctOn?: InputMaybe<Array<payrollDashboardStatsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollDashboardStatsOrderBy>>;
  where?: InputMaybe<payrollDashboardStatsBoolExp>;
};


export type subscription_rootpayrollDashboardStatsAggregateArgs = {
  distinctOn?: InputMaybe<Array<payrollDashboardStatsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollDashboardStatsOrderBy>>;
  where?: InputMaybe<payrollDashboardStatsBoolExp>;
};


export type subscription_rootpayrollDashboardStatsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<payrollDashboardStatsStreamCursorInput>>;
  where?: InputMaybe<payrollDashboardStatsBoolExp>;
};


export type subscription_rootpayrollDateByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type subscription_rootpayrollDateTypeByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type subscription_rootpayrollDateTypesArgs = {
  distinctOn?: InputMaybe<Array<payrollDateTypesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollDateTypesOrderBy>>;
  where?: InputMaybe<payrollDateTypesBoolExp>;
};


export type subscription_rootpayrollDateTypesAggregateArgs = {
  distinctOn?: InputMaybe<Array<payrollDateTypesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollDateTypesOrderBy>>;
  where?: InputMaybe<payrollDateTypesBoolExp>;
};


export type subscription_rootpayrollDateTypesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<payrollDateTypesStreamCursorInput>>;
  where?: InputMaybe<payrollDateTypesBoolExp>;
};


export type subscription_rootpayrollDatesArgs = {
  distinctOn?: InputMaybe<Array<payrollDatesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollDatesOrderBy>>;
  where?: InputMaybe<payrollDatesBoolExp>;
};


export type subscription_rootpayrollDatesAggregateArgs = {
  distinctOn?: InputMaybe<Array<payrollDatesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollDatesOrderBy>>;
  where?: InputMaybe<payrollDatesBoolExp>;
};


export type subscription_rootpayrollDatesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<payrollDatesStreamCursorInput>>;
  where?: InputMaybe<payrollDatesBoolExp>;
};


export type subscription_rootpayrollTriggersStatusArgs = {
  distinctOn?: InputMaybe<Array<payrollTriggersStatusSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollTriggersStatusOrderBy>>;
  where?: InputMaybe<payrollTriggersStatusBoolExp>;
};


export type subscription_rootpayrollTriggersStatusAggregateArgs = {
  distinctOn?: InputMaybe<Array<payrollTriggersStatusSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollTriggersStatusOrderBy>>;
  where?: InputMaybe<payrollTriggersStatusBoolExp>;
};


export type subscription_rootpayrollTriggersStatusStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<payrollTriggersStatusStreamCursorInput>>;
  where?: InputMaybe<payrollTriggersStatusBoolExp>;
};


export type subscription_rootpayrollVersionHistoryResultByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type subscription_rootpayrollVersionHistoryResultsArgs = {
  distinctOn?: InputMaybe<Array<payrollVersionHistoryResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollVersionHistoryResultsOrderBy>>;
  where?: InputMaybe<payrollVersionHistoryResultsBoolExp>;
};


export type subscription_rootpayrollVersionHistoryResultsAggregateArgs = {
  distinctOn?: InputMaybe<Array<payrollVersionHistoryResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollVersionHistoryResultsOrderBy>>;
  where?: InputMaybe<payrollVersionHistoryResultsBoolExp>;
};


export type subscription_rootpayrollVersionHistoryResultsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<payrollVersionHistoryResultsStreamCursorInput>>;
  where?: InputMaybe<payrollVersionHistoryResultsBoolExp>;
};


export type subscription_rootpayrollVersionResultByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type subscription_rootpayrollVersionResultsArgs = {
  distinctOn?: InputMaybe<Array<payrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollVersionResultsOrderBy>>;
  where?: InputMaybe<payrollVersionResultsBoolExp>;
};


export type subscription_rootpayrollVersionResultsAggregateArgs = {
  distinctOn?: InputMaybe<Array<payrollVersionResultsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollVersionResultsOrderBy>>;
  where?: InputMaybe<payrollVersionResultsBoolExp>;
};


export type subscription_rootpayrollVersionResultsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<payrollVersionResultsStreamCursorInput>>;
  where?: InputMaybe<payrollVersionResultsBoolExp>;
};


export type subscription_rootpayrollsArgs = {
  distinctOn?: InputMaybe<Array<payrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollsOrderBy>>;
  where?: InputMaybe<payrollsBoolExp>;
};


export type subscription_rootpayrollsAggregateArgs = {
  distinctOn?: InputMaybe<Array<payrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollsOrderBy>>;
  where?: InputMaybe<payrollsBoolExp>;
};


export type subscription_rootpayrollsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<payrollsStreamCursorInput>>;
  where?: InputMaybe<payrollsBoolExp>;
};


export type subscription_rootpermissionAuditLogByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type subscription_rootpermissionAuditLogsArgs = {
  distinctOn?: InputMaybe<Array<permissionAuditLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<permissionAuditLogsOrderBy>>;
  where?: InputMaybe<permissionAuditLogsBoolExp>;
};


export type subscription_rootpermissionAuditLogsAggregateArgs = {
  distinctOn?: InputMaybe<Array<permissionAuditLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<permissionAuditLogsOrderBy>>;
  where?: InputMaybe<permissionAuditLogsBoolExp>;
};


export type subscription_rootpermissionAuditLogsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<permissionAuditLogsStreamCursorInput>>;
  where?: InputMaybe<permissionAuditLogsBoolExp>;
};


export type subscription_rootpermissionByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type subscription_rootpermissionChangeByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type subscription_rootpermissionChangesArgs = {
  distinctOn?: InputMaybe<Array<permissionChangesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<permissionChangesOrderBy>>;
  where?: InputMaybe<permissionChangesBoolExp>;
};


export type subscription_rootpermissionChangesAggregateArgs = {
  distinctOn?: InputMaybe<Array<permissionChangesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<permissionChangesOrderBy>>;
  where?: InputMaybe<permissionChangesBoolExp>;
};


export type subscription_rootpermissionChangesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<permissionChangesStreamCursorInput>>;
  where?: InputMaybe<permissionChangesBoolExp>;
};


export type subscription_rootpermissionOverrideByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type subscription_rootpermissionOverridesArgs = {
  distinctOn?: InputMaybe<Array<permissionOverridesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<permissionOverridesOrderBy>>;
  where?: InputMaybe<permissionOverridesBoolExp>;
};


export type subscription_rootpermissionOverridesAggregateArgs = {
  distinctOn?: InputMaybe<Array<permissionOverridesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<permissionOverridesOrderBy>>;
  where?: InputMaybe<permissionOverridesBoolExp>;
};


export type subscription_rootpermissionOverridesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<permissionOverridesStreamCursorInput>>;
  where?: InputMaybe<permissionOverridesBoolExp>;
};


export type subscription_rootpermissionUsageReportsArgs = {
  distinctOn?: InputMaybe<Array<permissionUsageReportsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<permissionUsageReportsOrderBy>>;
  where?: InputMaybe<permissionUsageReportsBoolExp>;
};


export type subscription_rootpermissionUsageReportsAggregateArgs = {
  distinctOn?: InputMaybe<Array<permissionUsageReportsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<permissionUsageReportsOrderBy>>;
  where?: InputMaybe<permissionUsageReportsBoolExp>;
};


export type subscription_rootpermissionUsageReportsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<permissionUsageReportsStreamCursorInput>>;
  where?: InputMaybe<permissionUsageReportsBoolExp>;
};


export type subscription_rootpermissionsArgs = {
  distinctOn?: InputMaybe<Array<permissionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<permissionsOrderBy>>;
  where?: InputMaybe<permissionsBoolExp>;
};


export type subscription_rootpermissionsAggregateArgs = {
  distinctOn?: InputMaybe<Array<permissionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<permissionsOrderBy>>;
  where?: InputMaybe<permissionsBoolExp>;
};


export type subscription_rootpermissionsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<permissionsStreamCursorInput>>;
  where?: InputMaybe<permissionsBoolExp>;
};


export type subscription_rootresourceByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type subscription_rootresourcesArgs = {
  distinctOn?: InputMaybe<Array<resourcesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<resourcesOrderBy>>;
  where?: InputMaybe<resourcesBoolExp>;
};


export type subscription_rootresourcesAggregateArgs = {
  distinctOn?: InputMaybe<Array<resourcesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<resourcesOrderBy>>;
  where?: InputMaybe<resourcesBoolExp>;
};


export type subscription_rootresourcesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<resourcesStreamCursorInput>>;
  where?: InputMaybe<resourcesBoolExp>;
};


export type subscription_rootroleByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type subscription_rootrolePermissionByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type subscription_rootrolePermissionsArgs = {
  distinctOn?: InputMaybe<Array<rolePermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<rolePermissionsOrderBy>>;
  where?: InputMaybe<rolePermissionsBoolExp>;
};


export type subscription_rootrolePermissionsAggregateArgs = {
  distinctOn?: InputMaybe<Array<rolePermissionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<rolePermissionsOrderBy>>;
  where?: InputMaybe<rolePermissionsBoolExp>;
};


export type subscription_rootrolePermissionsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<rolePermissionsStreamCursorInput>>;
  where?: InputMaybe<rolePermissionsBoolExp>;
};


export type subscription_rootrolesArgs = {
  distinctOn?: InputMaybe<Array<rolesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<rolesOrderBy>>;
  where?: InputMaybe<rolesBoolExp>;
};


export type subscription_rootrolesAggregateArgs = {
  distinctOn?: InputMaybe<Array<rolesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<rolesOrderBy>>;
  where?: InputMaybe<rolesBoolExp>;
};


export type subscription_rootrolesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<rolesStreamCursorInput>>;
  where?: InputMaybe<rolesBoolExp>;
};


export type subscription_rootslowQueriesArgs = {
  distinctOn?: InputMaybe<Array<slowQueriesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<slowQueriesOrderBy>>;
  where?: InputMaybe<slowQueriesBoolExp>;
};


export type subscription_rootslowQueriesAggregateArgs = {
  distinctOn?: InputMaybe<Array<slowQueriesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<slowQueriesOrderBy>>;
  where?: InputMaybe<slowQueriesBoolExp>;
};


export type subscription_rootslowQueriesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<slowQueriesStreamCursorInput>>;
  where?: InputMaybe<slowQueriesBoolExp>;
};


export type subscription_rootslowQueryByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type subscription_rootuserAccessSummariesArgs = {
  distinctOn?: InputMaybe<Array<userAccessSummariesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<userAccessSummariesOrderBy>>;
  where?: InputMaybe<userAccessSummariesBoolExp>;
};


export type subscription_rootuserAccessSummariesAggregateArgs = {
  distinctOn?: InputMaybe<Array<userAccessSummariesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<userAccessSummariesOrderBy>>;
  where?: InputMaybe<userAccessSummariesBoolExp>;
};


export type subscription_rootuserAccessSummariesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<userAccessSummariesStreamCursorInput>>;
  where?: InputMaybe<userAccessSummariesBoolExp>;
};


export type subscription_rootuserByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type subscription_rootuserInvitationByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type subscription_rootuserInvitationsArgs = {
  distinctOn?: InputMaybe<Array<userInvitationsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<userInvitationsOrderBy>>;
  where?: InputMaybe<userInvitationsBoolExp>;
};


export type subscription_rootuserInvitationsAggregateArgs = {
  distinctOn?: InputMaybe<Array<userInvitationsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<userInvitationsOrderBy>>;
  where?: InputMaybe<userInvitationsBoolExp>;
};


export type subscription_rootuserInvitationsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<userInvitationsStreamCursorInput>>;
  where?: InputMaybe<userInvitationsBoolExp>;
};


export type subscription_rootuserRoleByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type subscription_rootuserRolesArgs = {
  distinctOn?: InputMaybe<Array<userRolesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<userRolesOrderBy>>;
  where?: InputMaybe<userRolesBoolExp>;
};


export type subscription_rootuserRolesAggregateArgs = {
  distinctOn?: InputMaybe<Array<userRolesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<userRolesOrderBy>>;
  where?: InputMaybe<userRolesBoolExp>;
};


export type subscription_rootuserRolesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<userRolesStreamCursorInput>>;
  where?: InputMaybe<userRolesBoolExp>;
};


export type subscription_rootuserSyncByIdArgs = {
  id: Scalars['String']['input'];
};


export type subscription_rootusersArgs = {
  distinctOn?: InputMaybe<Array<usersSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<usersOrderBy>>;
  where?: InputMaybe<usersBoolExp>;
};


export type subscription_rootusersAggregateArgs = {
  distinctOn?: InputMaybe<Array<usersSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<usersOrderBy>>;
  where?: InputMaybe<usersBoolExp>;
};


export type subscription_rootusersRoleBackupStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<usersRoleBackupStreamCursorInput>>;
  where?: InputMaybe<usersRoleBackupBoolExp>;
};


export type subscription_rootusersRoleBackupsArgs = {
  distinctOn?: InputMaybe<Array<usersRoleBackupSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<usersRoleBackupOrderBy>>;
  where?: InputMaybe<usersRoleBackupBoolExp>;
};


export type subscription_rootusersRoleBackupsAggregateArgs = {
  distinctOn?: InputMaybe<Array<usersRoleBackupSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<usersRoleBackupOrderBy>>;
  where?: InputMaybe<usersRoleBackupBoolExp>;
};


export type subscription_rootusersStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<usersStreamCursorInput>>;
  where?: InputMaybe<usersBoolExp>;
};


export type subscription_rootusersSyncArgs = {
  distinctOn?: InputMaybe<Array<authUsersSyncSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<authUsersSyncOrderBy>>;
  where?: InputMaybe<authUsersSyncBoolExp>;
};


export type subscription_rootusersSyncAggregateArgs = {
  distinctOn?: InputMaybe<Array<authUsersSyncSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<authUsersSyncOrderBy>>;
  where?: InputMaybe<authUsersSyncBoolExp>;
};


export type subscription_rootworkScheduleByIdArgs = {
  id: Scalars['uuid']['input'];
};


export type subscription_rootworkSchedulesArgs = {
  distinctOn?: InputMaybe<Array<workSchedulesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<workSchedulesOrderBy>>;
  where?: InputMaybe<workSchedulesBoolExp>;
};


export type subscription_rootworkSchedulesAggregateArgs = {
  distinctOn?: InputMaybe<Array<workSchedulesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<workSchedulesOrderBy>>;
  where?: InputMaybe<workSchedulesBoolExp>;
};


export type subscription_rootworkSchedulesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<workSchedulesStreamCursorInput>>;
  where?: InputMaybe<workSchedulesBoolExp>;
};

/** columns and relationships of "audit.user_access_summary" */
export type userAccessSummaries = {
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
export type userAccessSummariesAggregate = {
  __typename?: 'userAccessSummariesAggregate';
  aggregate?: Maybe<userAccessSummariesAggregateFields>;
  nodes: Array<userAccessSummaries>;
};

/** aggregate fields of "audit.user_access_summary" */
export type userAccessSummariesAggregateFields = {
  __typename?: 'userAccessSummariesAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<userAccessSummariesMaxFields>;
  min?: Maybe<userAccessSummariesMinFields>;
};


/** aggregate fields of "audit.user_access_summary" */
export type userAccessSummariesAggregateFieldscountArgs = {
  columns?: InputMaybe<Array<userAccessSummariesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "audit.user_access_summary". All fields are combined with a logical 'AND'. */
export type userAccessSummariesBoolExp = {
  _and?: InputMaybe<Array<userAccessSummariesBoolExp>>;
  _not?: InputMaybe<userAccessSummariesBoolExp>;
  _or?: InputMaybe<Array<userAccessSummariesBoolExp>>;
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
export type userAccessSummariesInsertInput = {
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
export type userAccessSummariesMaxFields = {
  __typename?: 'userAccessSummariesMaxFields';
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Scalars['user_role']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type userAccessSummariesMinFields = {
  __typename?: 'userAccessSummariesMinFields';
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Scalars['user_role']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "audit.user_access_summary" */
export type userAccessSummariesMutationResponse = {
  __typename?: 'userAccessSummariesMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<userAccessSummaries>;
};

/** Ordering options when selecting data from "audit.user_access_summary". */
export type userAccessSummariesOrderBy = {
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
export type userAccessSummariesSelectColumn =
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
  | 'updatedAt';

/** input type for updating data in table "audit.user_access_summary" */
export type userAccessSummariesSetInput = {
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
export type userAccessSummariesStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: userAccessSummariesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type userAccessSummariesStreamCursorValueInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isStaff?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['user_role']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

export type userAccessSummariesUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<userAccessSummariesSetInput>;
  /** filter the rows which have to be updated */
  where: userAccessSummariesBoolExp;
};

/** Stores invitation metadata for two-stage user invitation flow with role-based access control */
export type userInvitations = {
  __typename?: 'userInvitations';
  acceptedAt?: Maybe<Scalars['timestamptz']['output']>;
  acceptedBy?: Maybe<Scalars['uuid']['output']>;
  /** An object relationship */
  acceptedByUser?: Maybe<users>;
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
  invitedByUser?: Maybe<users>;
  invitedRole: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  managerId?: Maybe<Scalars['uuid']['output']>;
  /** An object relationship */
  managerUser?: Maybe<users>;
  status: Scalars['String']['output'];
  updatedAt: Scalars['timestamptz']['output'];
};


/** Stores invitation metadata for two-stage user invitation flow with role-based access control */
export type userInvitationsinvitationMetadataArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "user_invitations" */
export type userInvitationsAggregate = {
  __typename?: 'userInvitationsAggregate';
  aggregate?: Maybe<userInvitationsAggregateFields>;
  nodes: Array<userInvitations>;
};

export type userInvitationsAggregateBoolExp = {
  count?: InputMaybe<userInvitationsAggregateBoolExpCount>;
};

export type userInvitationsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<userInvitationsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<userInvitationsBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "user_invitations" */
export type userInvitationsAggregateFields = {
  __typename?: 'userInvitationsAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<userInvitationsMaxFields>;
  min?: Maybe<userInvitationsMinFields>;
};


/** aggregate fields of "user_invitations" */
export type userInvitationsAggregateFieldscountArgs = {
  columns?: InputMaybe<Array<userInvitationsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "user_invitations" */
export type userInvitationsAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<userInvitationsMaxOrderBy>;
  min?: InputMaybe<userInvitationsMinOrderBy>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type userInvitationsAppendInput = {
  invitationMetadata?: InputMaybe<Scalars['jsonb']['input']>;
};

/** input type for inserting array relation for remote table "user_invitations" */
export type userInvitationsArrRelInsertInput = {
  data: Array<userInvitationsInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<userInvitationsOnConflict>;
};

/** Boolean expression to filter rows from the table "user_invitations". All fields are combined with a logical 'AND'. */
export type userInvitationsBoolExp = {
  _and?: InputMaybe<Array<userInvitationsBoolExp>>;
  _not?: InputMaybe<userInvitationsBoolExp>;
  _or?: InputMaybe<Array<userInvitationsBoolExp>>;
  acceptedAt?: InputMaybe<TimestamptzComparisonExp>;
  acceptedBy?: InputMaybe<UuidComparisonExp>;
  acceptedByUser?: InputMaybe<usersBoolExp>;
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
  invitedByUser?: InputMaybe<usersBoolExp>;
  invitedRole?: InputMaybe<StringComparisonExp>;
  lastName?: InputMaybe<StringComparisonExp>;
  managerId?: InputMaybe<UuidComparisonExp>;
  managerUser?: InputMaybe<usersBoolExp>;
  status?: InputMaybe<StringComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "user_invitations" */
export type userInvitationsConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'user_invitations_pkey';

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type userInvitationsDeleteAtPathInput = {
  invitationMetadata?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type userInvitationsDeleteElemInput = {
  invitationMetadata?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type userInvitationsDeleteKeyInput = {
  invitationMetadata?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "user_invitations" */
export type userInvitationsInsertInput = {
  acceptedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  acceptedBy?: InputMaybe<Scalars['uuid']['input']>;
  acceptedByUser?: InputMaybe<usersObjRelInsertInput>;
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
  invitedByUser?: InputMaybe<usersObjRelInsertInput>;
  invitedRole?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  managerId?: InputMaybe<Scalars['uuid']['input']>;
  managerUser?: InputMaybe<usersObjRelInsertInput>;
  status?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type userInvitationsMaxFields = {
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

/** order by max() on columns of table "user_invitations" */
export type userInvitationsMaxOrderBy = {
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

/** aggregate min on columns */
export type userInvitationsMinFields = {
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

/** order by min() on columns of table "user_invitations" */
export type userInvitationsMinOrderBy = {
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

/** response of any mutation on the table "user_invitations" */
export type userInvitationsMutationResponse = {
  __typename?: 'userInvitationsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<userInvitations>;
};

/** on_conflict condition type for table "user_invitations" */
export type userInvitationsOnConflict = {
  constraint: userInvitationsConstraint;
  updateColumns?: Array<userInvitationsUpdateColumn>;
  where?: InputMaybe<userInvitationsBoolExp>;
};

/** Ordering options when selecting data from "user_invitations". */
export type userInvitationsOrderBy = {
  acceptedAt?: InputMaybe<OrderBy>;
  acceptedBy?: InputMaybe<OrderBy>;
  acceptedByUser?: InputMaybe<usersOrderBy>;
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
  invitedByUser?: InputMaybe<usersOrderBy>;
  invitedRole?: InputMaybe<OrderBy>;
  lastName?: InputMaybe<OrderBy>;
  managerId?: InputMaybe<OrderBy>;
  managerUser?: InputMaybe<usersOrderBy>;
  status?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: user_invitations */
export type userInvitationsPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type userInvitationsPrependInput = {
  invitationMetadata?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "user_invitations" */
export type userInvitationsSelectColumn =
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
  | 'updatedAt';

/** input type for updating data in table "user_invitations" */
export type userInvitationsSetInput = {
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
export type userInvitationsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: userInvitationsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type userInvitationsStreamCursorValueInput = {
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
export type userInvitationsUpdateColumn =
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
  | 'updatedAt';

export type userInvitationsUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<userInvitationsAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _deleteAtPath?: InputMaybe<userInvitationsDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _deleteElem?: InputMaybe<userInvitationsDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _deleteKey?: InputMaybe<userInvitationsDeleteKeyInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<userInvitationsPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<userInvitationsSetInput>;
  /** filter the rows which have to be updated */
  where: userInvitationsBoolExp;
};

/** columns and relationships of "user_roles" */
export type userRoles = {
  __typename?: 'userRoles';
  /** An object relationship */
  assignedRole: roles;
  createdAt: Scalars['timestamptz']['output'];
  id: Scalars['uuid']['output'];
  roleId: Scalars['uuid']['output'];
  /** An object relationship */
  roleUser: users;
  updatedAt: Scalars['timestamptz']['output'];
  userId: Scalars['uuid']['output'];
};

/** aggregated selection of "user_roles" */
export type userRolesAggregate = {
  __typename?: 'userRolesAggregate';
  aggregate?: Maybe<userRolesAggregateFields>;
  nodes: Array<userRoles>;
};

export type userRolesAggregateBoolExp = {
  count?: InputMaybe<userRolesAggregateBoolExpCount>;
};

export type userRolesAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<userRolesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<userRolesBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "user_roles" */
export type userRolesAggregateFields = {
  __typename?: 'userRolesAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<userRolesMaxFields>;
  min?: Maybe<userRolesMinFields>;
};


/** aggregate fields of "user_roles" */
export type userRolesAggregateFieldscountArgs = {
  columns?: InputMaybe<Array<userRolesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "user_roles" */
export type userRolesAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<userRolesMaxOrderBy>;
  min?: InputMaybe<userRolesMinOrderBy>;
};

/** input type for inserting array relation for remote table "user_roles" */
export type userRolesArrRelInsertInput = {
  data: Array<userRolesInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<userRolesOnConflict>;
};

/** Boolean expression to filter rows from the table "user_roles". All fields are combined with a logical 'AND'. */
export type userRolesBoolExp = {
  _and?: InputMaybe<Array<userRolesBoolExp>>;
  _not?: InputMaybe<userRolesBoolExp>;
  _or?: InputMaybe<Array<userRolesBoolExp>>;
  assignedRole?: InputMaybe<rolesBoolExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  roleId?: InputMaybe<UuidComparisonExp>;
  roleUser?: InputMaybe<usersBoolExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
  userId?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "user_roles" */
export type userRolesConstraint =
  /** unique or primary key constraint on columns "id" */
  | 'user_roles_pkey'
  /** unique or primary key constraint on columns "user_id", "role_id" */
  | 'user_roles_user_id_role_id_key';

/** input type for inserting data into table "user_roles" */
export type userRolesInsertInput = {
  assignedRole?: InputMaybe<rolesObjRelInsertInput>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  roleId?: InputMaybe<Scalars['uuid']['input']>;
  roleUser?: InputMaybe<usersObjRelInsertInput>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type userRolesMaxFields = {
  __typename?: 'userRolesMaxFields';
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  roleId?: Maybe<Scalars['uuid']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
  userId?: Maybe<Scalars['uuid']['output']>;
};

/** order by max() on columns of table "user_roles" */
export type userRolesMaxOrderBy = {
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  roleId?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type userRolesMinFields = {
  __typename?: 'userRolesMinFields';
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  roleId?: Maybe<Scalars['uuid']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
  userId?: Maybe<Scalars['uuid']['output']>;
};

/** order by min() on columns of table "user_roles" */
export type userRolesMinOrderBy = {
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  roleId?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "user_roles" */
export type userRolesMutationResponse = {
  __typename?: 'userRolesMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<userRoles>;
};

/** on_conflict condition type for table "user_roles" */
export type userRolesOnConflict = {
  constraint: userRolesConstraint;
  updateColumns?: Array<userRolesUpdateColumn>;
  where?: InputMaybe<userRolesBoolExp>;
};

/** Ordering options when selecting data from "user_roles". */
export type userRolesOrderBy = {
  assignedRole?: InputMaybe<rolesOrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  roleId?: InputMaybe<OrderBy>;
  roleUser?: InputMaybe<usersOrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: user_roles */
export type userRolesPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "user_roles" */
export type userRolesSelectColumn =
  /** column name */
  | 'createdAt'
  /** column name */
  | 'id'
  /** column name */
  | 'roleId'
  /** column name */
  | 'updatedAt'
  /** column name */
  | 'userId';

/** input type for updating data in table "user_roles" */
export type userRolesSetInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  roleId?: InputMaybe<Scalars['uuid']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "userRoles" */
export type userRolesStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: userRolesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type userRolesStreamCursorValueInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  roleId?: InputMaybe<Scalars['uuid']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "user_roles" */
export type userRolesUpdateColumn =
  /** column name */
  | 'createdAt'
  /** column name */
  | 'id'
  /** column name */
  | 'roleId'
  /** column name */
  | 'updatedAt'
  /** column name */
  | 'userId';

export type userRolesUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<userRolesSetInput>;
  /** filter the rows which have to be updated */
  where: userRolesBoolExp;
};

/** columns and relationships of "users" */
export type users = {
  __typename?: 'users';
  /** An array relationship */
  assignedRoles: Array<userRoles>;
  /** An aggregate relationship */
  assignedRolesAggregate: userRolesAggregate;
  /** An array relationship */
  authoredNotes: Array<notes>;
  /** An aggregate relationship */
  authoredNotesAggregate: notesAggregate;
  /** An array relationship */
  backupConsultantPayrolls: Array<payrolls>;
  /** An aggregate relationship */
  backupConsultantPayrollsAggregate: payrollsAggregate;
  /** External identifier from Clerk authentication service */
  clerkUserId?: Maybe<Scalars['String']['output']>;
  /** An array relationship */
  consultantAssignments: Array<payrollAssignments>;
  /** An aggregate relationship */
  consultantAssignmentsAggregate: payrollAssignmentsAggregate;
  /** An array relationship */
  createdAssignmentAudits: Array<payrollAssignmentAudits>;
  /** An aggregate relationship */
  createdAssignmentAuditsAggregate: payrollAssignmentAuditsAggregate;
  /** An array relationship */
  createdAssignments: Array<payrollAssignments>;
  /** An aggregate relationship */
  createdAssignmentsAggregate: payrollAssignmentsAggregate;
  /** Timestamp when the user was created */
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  /** An array relationship */
  createdBillingEvents: Array<billingEventLogs>;
  /** An aggregate relationship */
  createdBillingEventsAggregate: billingEventLogsAggregate;
  /** An array relationship */
  createdPermissionOverrides: Array<permissionOverrides>;
  /** An aggregate relationship */
  createdPermissionOverridesAggregate: permissionOverridesAggregate;
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
  managedPayrolls: Array<payrolls>;
  /** An aggregate relationship */
  managedPayrollsAggregate: payrollsAggregate;
  /** An array relationship */
  managedTeamMembers: Array<users>;
  /** An aggregate relationship */
  managedTeamMembersAggregate: usersAggregate;
  /** An array relationship */
  managedUsers: Array<users>;
  /** An aggregate relationship */
  managedUsersAggregate: usersAggregate;
  /** Reference to the user's manager */
  managerId?: Maybe<Scalars['uuid']['output']>;
  /** An object relationship */
  managerUser?: Maybe<users>;
  /** User's full name */
  name: Scalars['String']['output'];
  /** An array relationship */
  newConsultantAuditTrail: Array<payrollAssignmentAudits>;
  /** An aggregate relationship */
  newConsultantAuditTrailAggregate: payrollAssignmentAuditsAggregate;
  /** An array relationship */
  originalConsultantAssignments: Array<payrollAssignments>;
  /** An aggregate relationship */
  originalConsultantAssignmentsAggregate: payrollAssignmentsAggregate;
  /** An array relationship */
  originalConsultantAuditTrail: Array<payrollAssignmentAudits>;
  /** An aggregate relationship */
  originalConsultantAuditTrailAggregate: payrollAssignmentAuditsAggregate;
  /** An array relationship */
  primaryConsultantPayrolls: Array<payrolls>;
  /** An aggregate relationship */
  primaryConsultantPayrollsAggregate: payrollsAggregate;
  /** User's system role (viewer, consultant, manager, org_admin) */
  role: Scalars['user_role']['output'];
  /** An array relationship */
  targetedPermissionAudits: Array<permissionAuditLogs>;
  /** An aggregate relationship */
  targetedPermissionAuditsAggregate: permissionAuditLogsAggregate;
  /** Timestamp when the user was last updated */
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
  /** An array relationship */
  userInvitationsAcceptedBy: Array<userInvitations>;
  /** An aggregate relationship */
  userInvitationsAcceptedByAggregate: userInvitationsAggregate;
  /** An array relationship */
  userInvitationsInvitedBy: Array<userInvitations>;
  /** An aggregate relationship */
  userInvitationsInvitedByAggregate: userInvitationsAggregate;
  /** An array relationship */
  userInvitationsMangerId: Array<userInvitations>;
  /** An aggregate relationship */
  userInvitationsMangerIdAggregate: userInvitationsAggregate;
  /** An array relationship */
  userLeaveRecords: Array<leave>;
  /** An aggregate relationship */
  userLeaveRecordsAggregate: leaveAggregate;
  /** An array relationship */
  userPermissionAudits: Array<permissionAuditLogs>;
  /** An aggregate relationship */
  userPermissionAuditsAggregate: permissionAuditLogsAggregate;
  /** An array relationship */
  userPermissionOverrides: Array<permissionOverrides>;
  /** An aggregate relationship */
  userPermissionOverridesAggregate: permissionOverridesAggregate;
  /** An array relationship */
  userWorkSchedules: Array<workSchedules>;
  /** An aggregate relationship */
  userWorkSchedulesAggregate: workSchedulesAggregate;
  /** User's unique username for login */
  username?: Maybe<Scalars['String']['output']>;
};


/** columns and relationships of "users" */
export type usersassignedRolesArgs = {
  distinctOn?: InputMaybe<Array<userRolesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<userRolesOrderBy>>;
  where?: InputMaybe<userRolesBoolExp>;
};


/** columns and relationships of "users" */
export type usersassignedRolesAggregateArgs = {
  distinctOn?: InputMaybe<Array<userRolesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<userRolesOrderBy>>;
  where?: InputMaybe<userRolesBoolExp>;
};


/** columns and relationships of "users" */
export type usersauthoredNotesArgs = {
  distinctOn?: InputMaybe<Array<notesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<notesOrderBy>>;
  where?: InputMaybe<notesBoolExp>;
};


/** columns and relationships of "users" */
export type usersauthoredNotesAggregateArgs = {
  distinctOn?: InputMaybe<Array<notesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<notesOrderBy>>;
  where?: InputMaybe<notesBoolExp>;
};


/** columns and relationships of "users" */
export type usersbackupConsultantPayrollsArgs = {
  distinctOn?: InputMaybe<Array<payrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollsOrderBy>>;
  where?: InputMaybe<payrollsBoolExp>;
};


/** columns and relationships of "users" */
export type usersbackupConsultantPayrollsAggregateArgs = {
  distinctOn?: InputMaybe<Array<payrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollsOrderBy>>;
  where?: InputMaybe<payrollsBoolExp>;
};


/** columns and relationships of "users" */
export type usersconsultantAssignmentsArgs = {
  distinctOn?: InputMaybe<Array<payrollAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollAssignmentsOrderBy>>;
  where?: InputMaybe<payrollAssignmentsBoolExp>;
};


/** columns and relationships of "users" */
export type usersconsultantAssignmentsAggregateArgs = {
  distinctOn?: InputMaybe<Array<payrollAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollAssignmentsOrderBy>>;
  where?: InputMaybe<payrollAssignmentsBoolExp>;
};


/** columns and relationships of "users" */
export type userscreatedAssignmentAuditsArgs = {
  distinctOn?: InputMaybe<Array<payrollAssignmentAuditsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollAssignmentAuditsOrderBy>>;
  where?: InputMaybe<payrollAssignmentAuditsBoolExp>;
};


/** columns and relationships of "users" */
export type userscreatedAssignmentAuditsAggregateArgs = {
  distinctOn?: InputMaybe<Array<payrollAssignmentAuditsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollAssignmentAuditsOrderBy>>;
  where?: InputMaybe<payrollAssignmentAuditsBoolExp>;
};


/** columns and relationships of "users" */
export type userscreatedAssignmentsArgs = {
  distinctOn?: InputMaybe<Array<payrollAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollAssignmentsOrderBy>>;
  where?: InputMaybe<payrollAssignmentsBoolExp>;
};


/** columns and relationships of "users" */
export type userscreatedAssignmentsAggregateArgs = {
  distinctOn?: InputMaybe<Array<payrollAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollAssignmentsOrderBy>>;
  where?: InputMaybe<payrollAssignmentsBoolExp>;
};


/** columns and relationships of "users" */
export type userscreatedBillingEventsArgs = {
  distinctOn?: InputMaybe<Array<billingEventLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<billingEventLogsOrderBy>>;
  where?: InputMaybe<billingEventLogsBoolExp>;
};


/** columns and relationships of "users" */
export type userscreatedBillingEventsAggregateArgs = {
  distinctOn?: InputMaybe<Array<billingEventLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<billingEventLogsOrderBy>>;
  where?: InputMaybe<billingEventLogsBoolExp>;
};


/** columns and relationships of "users" */
export type userscreatedPermissionOverridesArgs = {
  distinctOn?: InputMaybe<Array<permissionOverridesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<permissionOverridesOrderBy>>;
  where?: InputMaybe<permissionOverridesBoolExp>;
};


/** columns and relationships of "users" */
export type userscreatedPermissionOverridesAggregateArgs = {
  distinctOn?: InputMaybe<Array<permissionOverridesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<permissionOverridesOrderBy>>;
  where?: InputMaybe<permissionOverridesBoolExp>;
};


/** columns and relationships of "users" */
export type usersmanagedPayrollsArgs = {
  distinctOn?: InputMaybe<Array<payrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollsOrderBy>>;
  where?: InputMaybe<payrollsBoolExp>;
};


/** columns and relationships of "users" */
export type usersmanagedPayrollsAggregateArgs = {
  distinctOn?: InputMaybe<Array<payrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollsOrderBy>>;
  where?: InputMaybe<payrollsBoolExp>;
};


/** columns and relationships of "users" */
export type usersmanagedTeamMembersArgs = {
  distinctOn?: InputMaybe<Array<usersSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<usersOrderBy>>;
  where?: InputMaybe<usersBoolExp>;
};


/** columns and relationships of "users" */
export type usersmanagedTeamMembersAggregateArgs = {
  distinctOn?: InputMaybe<Array<usersSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<usersOrderBy>>;
  where?: InputMaybe<usersBoolExp>;
};


/** columns and relationships of "users" */
export type usersmanagedUsersArgs = {
  distinctOn?: InputMaybe<Array<usersSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<usersOrderBy>>;
  where?: InputMaybe<usersBoolExp>;
};


/** columns and relationships of "users" */
export type usersmanagedUsersAggregateArgs = {
  distinctOn?: InputMaybe<Array<usersSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<usersOrderBy>>;
  where?: InputMaybe<usersBoolExp>;
};


/** columns and relationships of "users" */
export type usersnewConsultantAuditTrailArgs = {
  distinctOn?: InputMaybe<Array<payrollAssignmentAuditsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollAssignmentAuditsOrderBy>>;
  where?: InputMaybe<payrollAssignmentAuditsBoolExp>;
};


/** columns and relationships of "users" */
export type usersnewConsultantAuditTrailAggregateArgs = {
  distinctOn?: InputMaybe<Array<payrollAssignmentAuditsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollAssignmentAuditsOrderBy>>;
  where?: InputMaybe<payrollAssignmentAuditsBoolExp>;
};


/** columns and relationships of "users" */
export type usersoriginalConsultantAssignmentsArgs = {
  distinctOn?: InputMaybe<Array<payrollAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollAssignmentsOrderBy>>;
  where?: InputMaybe<payrollAssignmentsBoolExp>;
};


/** columns and relationships of "users" */
export type usersoriginalConsultantAssignmentsAggregateArgs = {
  distinctOn?: InputMaybe<Array<payrollAssignmentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollAssignmentsOrderBy>>;
  where?: InputMaybe<payrollAssignmentsBoolExp>;
};


/** columns and relationships of "users" */
export type usersoriginalConsultantAuditTrailArgs = {
  distinctOn?: InputMaybe<Array<payrollAssignmentAuditsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollAssignmentAuditsOrderBy>>;
  where?: InputMaybe<payrollAssignmentAuditsBoolExp>;
};


/** columns and relationships of "users" */
export type usersoriginalConsultantAuditTrailAggregateArgs = {
  distinctOn?: InputMaybe<Array<payrollAssignmentAuditsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollAssignmentAuditsOrderBy>>;
  where?: InputMaybe<payrollAssignmentAuditsBoolExp>;
};


/** columns and relationships of "users" */
export type usersprimaryConsultantPayrollsArgs = {
  distinctOn?: InputMaybe<Array<payrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollsOrderBy>>;
  where?: InputMaybe<payrollsBoolExp>;
};


/** columns and relationships of "users" */
export type usersprimaryConsultantPayrollsAggregateArgs = {
  distinctOn?: InputMaybe<Array<payrollsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<payrollsOrderBy>>;
  where?: InputMaybe<payrollsBoolExp>;
};


/** columns and relationships of "users" */
export type userstargetedPermissionAuditsArgs = {
  distinctOn?: InputMaybe<Array<permissionAuditLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<permissionAuditLogsOrderBy>>;
  where?: InputMaybe<permissionAuditLogsBoolExp>;
};


/** columns and relationships of "users" */
export type userstargetedPermissionAuditsAggregateArgs = {
  distinctOn?: InputMaybe<Array<permissionAuditLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<permissionAuditLogsOrderBy>>;
  where?: InputMaybe<permissionAuditLogsBoolExp>;
};


/** columns and relationships of "users" */
export type usersuserInvitationsAcceptedByArgs = {
  distinctOn?: InputMaybe<Array<userInvitationsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<userInvitationsOrderBy>>;
  where?: InputMaybe<userInvitationsBoolExp>;
};


/** columns and relationships of "users" */
export type usersuserInvitationsAcceptedByAggregateArgs = {
  distinctOn?: InputMaybe<Array<userInvitationsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<userInvitationsOrderBy>>;
  where?: InputMaybe<userInvitationsBoolExp>;
};


/** columns and relationships of "users" */
export type usersuserInvitationsInvitedByArgs = {
  distinctOn?: InputMaybe<Array<userInvitationsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<userInvitationsOrderBy>>;
  where?: InputMaybe<userInvitationsBoolExp>;
};


/** columns and relationships of "users" */
export type usersuserInvitationsInvitedByAggregateArgs = {
  distinctOn?: InputMaybe<Array<userInvitationsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<userInvitationsOrderBy>>;
  where?: InputMaybe<userInvitationsBoolExp>;
};


/** columns and relationships of "users" */
export type usersuserInvitationsMangerIdArgs = {
  distinctOn?: InputMaybe<Array<userInvitationsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<userInvitationsOrderBy>>;
  where?: InputMaybe<userInvitationsBoolExp>;
};


/** columns and relationships of "users" */
export type usersuserInvitationsMangerIdAggregateArgs = {
  distinctOn?: InputMaybe<Array<userInvitationsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<userInvitationsOrderBy>>;
  where?: InputMaybe<userInvitationsBoolExp>;
};


/** columns and relationships of "users" */
export type usersuserLeaveRecordsArgs = {
  distinctOn?: InputMaybe<Array<leaveSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<leaveOrderBy>>;
  where?: InputMaybe<leaveBoolExp>;
};


/** columns and relationships of "users" */
export type usersuserLeaveRecordsAggregateArgs = {
  distinctOn?: InputMaybe<Array<leaveSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<leaveOrderBy>>;
  where?: InputMaybe<leaveBoolExp>;
};


/** columns and relationships of "users" */
export type usersuserPermissionAuditsArgs = {
  distinctOn?: InputMaybe<Array<permissionAuditLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<permissionAuditLogsOrderBy>>;
  where?: InputMaybe<permissionAuditLogsBoolExp>;
};


/** columns and relationships of "users" */
export type usersuserPermissionAuditsAggregateArgs = {
  distinctOn?: InputMaybe<Array<permissionAuditLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<permissionAuditLogsOrderBy>>;
  where?: InputMaybe<permissionAuditLogsBoolExp>;
};


/** columns and relationships of "users" */
export type usersuserPermissionOverridesArgs = {
  distinctOn?: InputMaybe<Array<permissionOverridesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<permissionOverridesOrderBy>>;
  where?: InputMaybe<permissionOverridesBoolExp>;
};


/** columns and relationships of "users" */
export type usersuserPermissionOverridesAggregateArgs = {
  distinctOn?: InputMaybe<Array<permissionOverridesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<permissionOverridesOrderBy>>;
  where?: InputMaybe<permissionOverridesBoolExp>;
};


/** columns and relationships of "users" */
export type usersuserWorkSchedulesArgs = {
  distinctOn?: InputMaybe<Array<workSchedulesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<workSchedulesOrderBy>>;
  where?: InputMaybe<workSchedulesBoolExp>;
};


/** columns and relationships of "users" */
export type usersuserWorkSchedulesAggregateArgs = {
  distinctOn?: InputMaybe<Array<workSchedulesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<workSchedulesOrderBy>>;
  where?: InputMaybe<workSchedulesBoolExp>;
};

/** aggregated selection of "users" */
export type usersAggregate = {
  __typename?: 'usersAggregate';
  aggregate?: Maybe<usersAggregateFields>;
  nodes: Array<users>;
};

export type usersAggregateBoolExp = {
  bool_and?: InputMaybe<usersAggregateBoolExpBool_and>;
  bool_or?: InputMaybe<usersAggregateBoolExpBool_or>;
  count?: InputMaybe<usersAggregateBoolExpCount>;
};

export type usersAggregateBoolExpBool_and = {
  arguments: usersSelectColumnUsersAggregateBoolExpBool_andArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<usersBoolExp>;
  predicate: BooleanComparisonExp;
};

export type usersAggregateBoolExpBool_or = {
  arguments: usersSelectColumnUsersAggregateBoolExpBool_orArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<usersBoolExp>;
  predicate: BooleanComparisonExp;
};

export type usersAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<usersSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<usersBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "users" */
export type usersAggregateFields = {
  __typename?: 'usersAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<usersMaxFields>;
  min?: Maybe<usersMinFields>;
};


/** aggregate fields of "users" */
export type usersAggregateFieldscountArgs = {
  columns?: InputMaybe<Array<usersSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "users" */
export type usersAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<usersMaxOrderBy>;
  min?: InputMaybe<usersMinOrderBy>;
};

/** input type for inserting array relation for remote table "users" */
export type usersArrRelInsertInput = {
  data: Array<usersInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<usersOnConflict>;
};

/** Boolean expression to filter rows from the table "users". All fields are combined with a logical 'AND'. */
export type usersBoolExp = {
  _and?: InputMaybe<Array<usersBoolExp>>;
  _not?: InputMaybe<usersBoolExp>;
  _or?: InputMaybe<Array<usersBoolExp>>;
  assignedRoles?: InputMaybe<userRolesBoolExp>;
  assignedRolesAggregate?: InputMaybe<userRolesAggregateBoolExp>;
  authoredNotes?: InputMaybe<notesBoolExp>;
  authoredNotesAggregate?: InputMaybe<notesAggregateBoolExp>;
  backupConsultantPayrolls?: InputMaybe<payrollsBoolExp>;
  backupConsultantPayrollsAggregate?: InputMaybe<payrollsAggregateBoolExp>;
  clerkUserId?: InputMaybe<StringComparisonExp>;
  consultantAssignments?: InputMaybe<payrollAssignmentsBoolExp>;
  consultantAssignmentsAggregate?: InputMaybe<payrollAssignmentsAggregateBoolExp>;
  createdAssignmentAudits?: InputMaybe<payrollAssignmentAuditsBoolExp>;
  createdAssignmentAuditsAggregate?: InputMaybe<payrollAssignmentAuditsAggregateBoolExp>;
  createdAssignments?: InputMaybe<payrollAssignmentsBoolExp>;
  createdAssignmentsAggregate?: InputMaybe<payrollAssignmentsAggregateBoolExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  createdBillingEvents?: InputMaybe<billingEventLogsBoolExp>;
  createdBillingEventsAggregate?: InputMaybe<billingEventLogsAggregateBoolExp>;
  createdPermissionOverrides?: InputMaybe<permissionOverridesBoolExp>;
  createdPermissionOverridesAggregate?: InputMaybe<permissionOverridesAggregateBoolExp>;
  deactivatedAt?: InputMaybe<TimestamptzComparisonExp>;
  deactivatedBy?: InputMaybe<StringComparisonExp>;
  email?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  image?: InputMaybe<StringComparisonExp>;
  isActive?: InputMaybe<BooleanComparisonExp>;
  isStaff?: InputMaybe<BooleanComparisonExp>;
  managedPayrolls?: InputMaybe<payrollsBoolExp>;
  managedPayrollsAggregate?: InputMaybe<payrollsAggregateBoolExp>;
  managedTeamMembers?: InputMaybe<usersBoolExp>;
  managedTeamMembersAggregate?: InputMaybe<usersAggregateBoolExp>;
  managedUsers?: InputMaybe<usersBoolExp>;
  managedUsersAggregate?: InputMaybe<usersAggregateBoolExp>;
  managerId?: InputMaybe<UuidComparisonExp>;
  managerUser?: InputMaybe<usersBoolExp>;
  name?: InputMaybe<StringComparisonExp>;
  newConsultantAuditTrail?: InputMaybe<payrollAssignmentAuditsBoolExp>;
  newConsultantAuditTrailAggregate?: InputMaybe<payrollAssignmentAuditsAggregateBoolExp>;
  originalConsultantAssignments?: InputMaybe<payrollAssignmentsBoolExp>;
  originalConsultantAssignmentsAggregate?: InputMaybe<payrollAssignmentsAggregateBoolExp>;
  originalConsultantAuditTrail?: InputMaybe<payrollAssignmentAuditsBoolExp>;
  originalConsultantAuditTrailAggregate?: InputMaybe<payrollAssignmentAuditsAggregateBoolExp>;
  primaryConsultantPayrolls?: InputMaybe<payrollsBoolExp>;
  primaryConsultantPayrollsAggregate?: InputMaybe<payrollsAggregateBoolExp>;
  role?: InputMaybe<UserRoleComparisonExp>;
  targetedPermissionAudits?: InputMaybe<permissionAuditLogsBoolExp>;
  targetedPermissionAuditsAggregate?: InputMaybe<permissionAuditLogsAggregateBoolExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
  userInvitationsAcceptedBy?: InputMaybe<userInvitationsBoolExp>;
  userInvitationsAcceptedByAggregate?: InputMaybe<userInvitationsAggregateBoolExp>;
  userInvitationsInvitedBy?: InputMaybe<userInvitationsBoolExp>;
  userInvitationsInvitedByAggregate?: InputMaybe<userInvitationsAggregateBoolExp>;
  userInvitationsMangerId?: InputMaybe<userInvitationsBoolExp>;
  userInvitationsMangerIdAggregate?: InputMaybe<userInvitationsAggregateBoolExp>;
  userLeaveRecords?: InputMaybe<leaveBoolExp>;
  userLeaveRecordsAggregate?: InputMaybe<leaveAggregateBoolExp>;
  userPermissionAudits?: InputMaybe<permissionAuditLogsBoolExp>;
  userPermissionAuditsAggregate?: InputMaybe<permissionAuditLogsAggregateBoolExp>;
  userPermissionOverrides?: InputMaybe<permissionOverridesBoolExp>;
  userPermissionOverridesAggregate?: InputMaybe<permissionOverridesAggregateBoolExp>;
  userWorkSchedules?: InputMaybe<workSchedulesBoolExp>;
  userWorkSchedulesAggregate?: InputMaybe<workSchedulesAggregateBoolExp>;
  username?: InputMaybe<StringComparisonExp>;
};

/** unique or primary key constraints on table "users" */
export type usersConstraint =
  /** unique or primary key constraint on columns "clerk_user_id" */
  | 'users_clerk_user_id_key'
  /** unique or primary key constraint on columns "email" */
  | 'users_email_key'
  /** unique or primary key constraint on columns "id" */
  | 'users_pkey'
  /** unique or primary key constraint on columns "username" */
  | 'users_username_key';

/** input type for inserting data into table "users" */
export type usersInsertInput = {
  assignedRoles?: InputMaybe<userRolesArrRelInsertInput>;
  authoredNotes?: InputMaybe<notesArrRelInsertInput>;
  backupConsultantPayrolls?: InputMaybe<payrollsArrRelInsertInput>;
  /** External identifier from Clerk authentication service */
  clerkUserId?: InputMaybe<Scalars['String']['input']>;
  consultantAssignments?: InputMaybe<payrollAssignmentsArrRelInsertInput>;
  createdAssignmentAudits?: InputMaybe<payrollAssignmentAuditsArrRelInsertInput>;
  createdAssignments?: InputMaybe<payrollAssignmentsArrRelInsertInput>;
  /** Timestamp when the user was created */
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  createdBillingEvents?: InputMaybe<billingEventLogsArrRelInsertInput>;
  createdPermissionOverrides?: InputMaybe<permissionOverridesArrRelInsertInput>;
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
  managedPayrolls?: InputMaybe<payrollsArrRelInsertInput>;
  managedTeamMembers?: InputMaybe<usersArrRelInsertInput>;
  managedUsers?: InputMaybe<usersArrRelInsertInput>;
  /** Reference to the user's manager */
  managerId?: InputMaybe<Scalars['uuid']['input']>;
  managerUser?: InputMaybe<usersObjRelInsertInput>;
  /** User's full name */
  name?: InputMaybe<Scalars['String']['input']>;
  newConsultantAuditTrail?: InputMaybe<payrollAssignmentAuditsArrRelInsertInput>;
  originalConsultantAssignments?: InputMaybe<payrollAssignmentsArrRelInsertInput>;
  originalConsultantAuditTrail?: InputMaybe<payrollAssignmentAuditsArrRelInsertInput>;
  primaryConsultantPayrolls?: InputMaybe<payrollsArrRelInsertInput>;
  /** User's system role (viewer, consultant, manager, org_admin) */
  role?: InputMaybe<Scalars['user_role']['input']>;
  targetedPermissionAudits?: InputMaybe<permissionAuditLogsArrRelInsertInput>;
  /** Timestamp when the user was last updated */
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  userInvitationsAcceptedBy?: InputMaybe<userInvitationsArrRelInsertInput>;
  userInvitationsInvitedBy?: InputMaybe<userInvitationsArrRelInsertInput>;
  userInvitationsMangerId?: InputMaybe<userInvitationsArrRelInsertInput>;
  userLeaveRecords?: InputMaybe<leaveArrRelInsertInput>;
  userPermissionAudits?: InputMaybe<permissionAuditLogsArrRelInsertInput>;
  userPermissionOverrides?: InputMaybe<permissionOverridesArrRelInsertInput>;
  userWorkSchedules?: InputMaybe<workSchedulesArrRelInsertInput>;
  /** User's unique username for login */
  username?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type usersMaxFields = {
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
export type usersMaxOrderBy = {
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
export type usersMinFields = {
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
export type usersMinOrderBy = {
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
export type usersMutationResponse = {
  __typename?: 'usersMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<users>;
};

/** input type for inserting object relation for remote table "users" */
export type usersObjRelInsertInput = {
  data: usersInsertInput;
  /** upsert condition */
  onConflict?: InputMaybe<usersOnConflict>;
};

/** on_conflict condition type for table "users" */
export type usersOnConflict = {
  constraint: usersConstraint;
  updateColumns?: Array<usersUpdateColumn>;
  where?: InputMaybe<usersBoolExp>;
};

/** Ordering options when selecting data from "users". */
export type usersOrderBy = {
  assignedRolesAggregate?: InputMaybe<userRolesAggregateOrderBy>;
  authoredNotesAggregate?: InputMaybe<notesAggregateOrderBy>;
  backupConsultantPayrollsAggregate?: InputMaybe<payrollsAggregateOrderBy>;
  clerkUserId?: InputMaybe<OrderBy>;
  consultantAssignmentsAggregate?: InputMaybe<payrollAssignmentsAggregateOrderBy>;
  createdAssignmentAuditsAggregate?: InputMaybe<payrollAssignmentAuditsAggregateOrderBy>;
  createdAssignmentsAggregate?: InputMaybe<payrollAssignmentsAggregateOrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  createdBillingEventsAggregate?: InputMaybe<billingEventLogsAggregateOrderBy>;
  createdPermissionOverridesAggregate?: InputMaybe<permissionOverridesAggregateOrderBy>;
  deactivatedAt?: InputMaybe<OrderBy>;
  deactivatedBy?: InputMaybe<OrderBy>;
  email?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  image?: InputMaybe<OrderBy>;
  isActive?: InputMaybe<OrderBy>;
  isStaff?: InputMaybe<OrderBy>;
  managedPayrollsAggregate?: InputMaybe<payrollsAggregateOrderBy>;
  managedTeamMembersAggregate?: InputMaybe<usersAggregateOrderBy>;
  managedUsersAggregate?: InputMaybe<usersAggregateOrderBy>;
  managerId?: InputMaybe<OrderBy>;
  managerUser?: InputMaybe<usersOrderBy>;
  name?: InputMaybe<OrderBy>;
  newConsultantAuditTrailAggregate?: InputMaybe<payrollAssignmentAuditsAggregateOrderBy>;
  originalConsultantAssignmentsAggregate?: InputMaybe<payrollAssignmentsAggregateOrderBy>;
  originalConsultantAuditTrailAggregate?: InputMaybe<payrollAssignmentAuditsAggregateOrderBy>;
  primaryConsultantPayrollsAggregate?: InputMaybe<payrollsAggregateOrderBy>;
  role?: InputMaybe<OrderBy>;
  targetedPermissionAuditsAggregate?: InputMaybe<permissionAuditLogsAggregateOrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  userInvitationsAcceptedByAggregate?: InputMaybe<userInvitationsAggregateOrderBy>;
  userInvitationsInvitedByAggregate?: InputMaybe<userInvitationsAggregateOrderBy>;
  userInvitationsMangerIdAggregate?: InputMaybe<userInvitationsAggregateOrderBy>;
  userLeaveRecordsAggregate?: InputMaybe<leaveAggregateOrderBy>;
  userPermissionAuditsAggregate?: InputMaybe<permissionAuditLogsAggregateOrderBy>;
  userPermissionOverridesAggregate?: InputMaybe<permissionOverridesAggregateOrderBy>;
  userWorkSchedulesAggregate?: InputMaybe<workSchedulesAggregateOrderBy>;
  username?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: users */
export type usersPkColumnsInput = {
  /** Unique identifier for the user */
  id: Scalars['uuid']['input'];
};

/** columns and relationships of "users_role_backup" */
export type usersRoleBackup = {
  __typename?: 'usersRoleBackup';
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  role?: Maybe<Scalars['user_role']['output']>;
};

/** aggregated selection of "users_role_backup" */
export type usersRoleBackupAggregate = {
  __typename?: 'usersRoleBackupAggregate';
  aggregate?: Maybe<usersRoleBackupAggregateFields>;
  nodes: Array<usersRoleBackup>;
};

/** aggregate fields of "users_role_backup" */
export type usersRoleBackupAggregateFields = {
  __typename?: 'usersRoleBackupAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<usersRoleBackupMaxFields>;
  min?: Maybe<usersRoleBackupMinFields>;
};


/** aggregate fields of "users_role_backup" */
export type usersRoleBackupAggregateFieldscountArgs = {
  columns?: InputMaybe<Array<usersRoleBackupSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "users_role_backup". All fields are combined with a logical 'AND'. */
export type usersRoleBackupBoolExp = {
  _and?: InputMaybe<Array<usersRoleBackupBoolExp>>;
  _not?: InputMaybe<usersRoleBackupBoolExp>;
  _or?: InputMaybe<Array<usersRoleBackupBoolExp>>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  email?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  role?: InputMaybe<UserRoleComparisonExp>;
};

/** input type for inserting data into table "users_role_backup" */
export type usersRoleBackupInsertInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  role?: InputMaybe<Scalars['user_role']['input']>;
};

/** aggregate max on columns */
export type usersRoleBackupMaxFields = {
  __typename?: 'usersRoleBackupMaxFields';
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  role?: Maybe<Scalars['user_role']['output']>;
};

/** aggregate min on columns */
export type usersRoleBackupMinFields = {
  __typename?: 'usersRoleBackupMinFields';
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  role?: Maybe<Scalars['user_role']['output']>;
};

/** response of any mutation on the table "users_role_backup" */
export type usersRoleBackupMutationResponse = {
  __typename?: 'usersRoleBackupMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<usersRoleBackup>;
};

/** Ordering options when selecting data from "users_role_backup". */
export type usersRoleBackupOrderBy = {
  createdAt?: InputMaybe<OrderBy>;
  email?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  role?: InputMaybe<OrderBy>;
};

/** select columns of table "users_role_backup" */
export type usersRoleBackupSelectColumn =
  /** column name */
  | 'createdAt'
  /** column name */
  | 'email'
  /** column name */
  | 'id'
  /** column name */
  | 'role';

/** input type for updating data in table "users_role_backup" */
export type usersRoleBackupSetInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  role?: InputMaybe<Scalars['user_role']['input']>;
};

/** Streaming cursor of the table "usersRoleBackup" */
export type usersRoleBackupStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: usersRoleBackupStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type usersRoleBackupStreamCursorValueInput = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  role?: InputMaybe<Scalars['user_role']['input']>;
};

export type usersRoleBackupUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<usersRoleBackupSetInput>;
  /** filter the rows which have to be updated */
  where: usersRoleBackupBoolExp;
};

/** select columns of table "users" */
export type usersSelectColumn =
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
  | 'username';

/** select "usersAggregateBoolExpBool_andArgumentsColumns" columns of table "users" */
export type usersSelectColumnUsersAggregateBoolExpBool_andArgumentsColumns =
  /** column name */
  | 'isActive'
  /** column name */
  | 'isStaff';

/** select "usersAggregateBoolExpBool_orArgumentsColumns" columns of table "users" */
export type usersSelectColumnUsersAggregateBoolExpBool_orArgumentsColumns =
  /** column name */
  | 'isActive'
  /** column name */
  | 'isStaff';

/** input type for updating data in table "users" */
export type usersSetInput = {
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
export type usersStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: usersStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type usersStreamCursorValueInput = {
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
export type usersUpdateColumn =
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
  | 'username';

export type usersUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<usersSetInput>;
  /** filter the rows which have to be updated */
  where: usersBoolExp;
};

/** columns and relationships of "work_schedule" */
export type workSchedules = {
  __typename?: 'workSchedules';
  /** Timestamp when the schedule entry was created */
  createdAt?: Maybe<Scalars['timestamp']['output']>;
  /** Unique identifier for the work schedule entry */
  id: Scalars['uuid']['output'];
  /** An object relationship */
  scheduleOwner: users;
  /** Timestamp when the schedule entry was last updated */
  updatedAt?: Maybe<Scalars['timestamp']['output']>;
  /** Reference to the user this schedule belongs to */
  userId: Scalars['uuid']['output'];
  /** Day of the week (Monday, Tuesday, etc.) */
  workDay: Scalars['String']['output'];
  /** Number of hours worked on this day */
  workHours: Scalars['numeric']['output'];
  /** An object relationship */
  workScheduleUser: users;
};

/** aggregated selection of "work_schedule" */
export type workSchedulesAggregate = {
  __typename?: 'workSchedulesAggregate';
  aggregate?: Maybe<workSchedulesAggregateFields>;
  nodes: Array<workSchedules>;
};

export type workSchedulesAggregateBoolExp = {
  count?: InputMaybe<workSchedulesAggregateBoolExpCount>;
};

export type workSchedulesAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<workSchedulesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<workSchedulesBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "work_schedule" */
export type workSchedulesAggregateFields = {
  __typename?: 'workSchedulesAggregateFields';
  avg?: Maybe<workSchedulesAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<workSchedulesMaxFields>;
  min?: Maybe<workSchedulesMinFields>;
  stddev?: Maybe<workSchedulesStddevFields>;
  stddevPop?: Maybe<workSchedulesStddevPopFields>;
  stddevSamp?: Maybe<workSchedulesStddevSampFields>;
  sum?: Maybe<workSchedulesSumFields>;
  varPop?: Maybe<workSchedulesVarPopFields>;
  varSamp?: Maybe<workSchedulesVarSampFields>;
  variance?: Maybe<workSchedulesVarianceFields>;
};


/** aggregate fields of "work_schedule" */
export type workSchedulesAggregateFieldscountArgs = {
  columns?: InputMaybe<Array<workSchedulesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "work_schedule" */
export type workSchedulesAggregateOrderBy = {
  avg?: InputMaybe<workSchedulesAvgOrderBy>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<workSchedulesMaxOrderBy>;
  min?: InputMaybe<workSchedulesMinOrderBy>;
  stddev?: InputMaybe<workSchedulesStddevOrderBy>;
  stddevPop?: InputMaybe<workSchedulesStddevPopOrderBy>;
  stddevSamp?: InputMaybe<workSchedulesStddevSampOrderBy>;
  sum?: InputMaybe<workSchedulesSumOrderBy>;
  varPop?: InputMaybe<workSchedulesVarPopOrderBy>;
  varSamp?: InputMaybe<workSchedulesVarSampOrderBy>;
  variance?: InputMaybe<workSchedulesVarianceOrderBy>;
};

/** input type for inserting array relation for remote table "work_schedule" */
export type workSchedulesArrRelInsertInput = {
  data: Array<workSchedulesInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<workSchedulesOnConflict>;
};

/** aggregate avg on columns */
export type workSchedulesAvgFields = {
  __typename?: 'workSchedulesAvgFields';
  /** Number of hours worked on this day */
  workHours?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "work_schedule" */
export type workSchedulesAvgOrderBy = {
  /** Number of hours worked on this day */
  workHours?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "work_schedule". All fields are combined with a logical 'AND'. */
export type workSchedulesBoolExp = {
  _and?: InputMaybe<Array<workSchedulesBoolExp>>;
  _not?: InputMaybe<workSchedulesBoolExp>;
  _or?: InputMaybe<Array<workSchedulesBoolExp>>;
  createdAt?: InputMaybe<TimestampComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  scheduleOwner?: InputMaybe<usersBoolExp>;
  updatedAt?: InputMaybe<TimestampComparisonExp>;
  userId?: InputMaybe<UuidComparisonExp>;
  workDay?: InputMaybe<StringComparisonExp>;
  workHours?: InputMaybe<NumericComparisonExp>;
  workScheduleUser?: InputMaybe<usersBoolExp>;
};

/** unique or primary key constraints on table "work_schedule" */
export type workSchedulesConstraint =
  /** unique or primary key constraint on columns "user_id", "work_day" */
  | 'unique_user_work_day'
  /** unique or primary key constraint on columns "id" */
  | 'work_schedule_pkey';

/** input type for incrementing numeric columns in table "work_schedule" */
export type workSchedulesIncInput = {
  /** Number of hours worked on this day */
  workHours?: InputMaybe<Scalars['numeric']['input']>;
};

/** input type for inserting data into table "work_schedule" */
export type workSchedulesInsertInput = {
  /** Timestamp when the schedule entry was created */
  createdAt?: InputMaybe<Scalars['timestamp']['input']>;
  /** Unique identifier for the work schedule entry */
  id?: InputMaybe<Scalars['uuid']['input']>;
  scheduleOwner?: InputMaybe<usersObjRelInsertInput>;
  /** Timestamp when the schedule entry was last updated */
  updatedAt?: InputMaybe<Scalars['timestamp']['input']>;
  /** Reference to the user this schedule belongs to */
  userId?: InputMaybe<Scalars['uuid']['input']>;
  /** Day of the week (Monday, Tuesday, etc.) */
  workDay?: InputMaybe<Scalars['String']['input']>;
  /** Number of hours worked on this day */
  workHours?: InputMaybe<Scalars['numeric']['input']>;
  workScheduleUser?: InputMaybe<usersObjRelInsertInput>;
};

/** aggregate max on columns */
export type workSchedulesMaxFields = {
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
export type workSchedulesMaxOrderBy = {
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
export type workSchedulesMinFields = {
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
export type workSchedulesMinOrderBy = {
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
export type workSchedulesMutationResponse = {
  __typename?: 'workSchedulesMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<workSchedules>;
};

/** on_conflict condition type for table "work_schedule" */
export type workSchedulesOnConflict = {
  constraint: workSchedulesConstraint;
  updateColumns?: Array<workSchedulesUpdateColumn>;
  where?: InputMaybe<workSchedulesBoolExp>;
};

/** Ordering options when selecting data from "work_schedule". */
export type workSchedulesOrderBy = {
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  scheduleOwner?: InputMaybe<usersOrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
  workDay?: InputMaybe<OrderBy>;
  workHours?: InputMaybe<OrderBy>;
  workScheduleUser?: InputMaybe<usersOrderBy>;
};

/** primary key columns input for table: work_schedule */
export type workSchedulesPkColumnsInput = {
  /** Unique identifier for the work schedule entry */
  id: Scalars['uuid']['input'];
};

/** select columns of table "work_schedule" */
export type workSchedulesSelectColumn =
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
  | 'workHours';

/** input type for updating data in table "work_schedule" */
export type workSchedulesSetInput = {
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
export type workSchedulesStddevFields = {
  __typename?: 'workSchedulesStddevFields';
  /** Number of hours worked on this day */
  workHours?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "work_schedule" */
export type workSchedulesStddevOrderBy = {
  /** Number of hours worked on this day */
  workHours?: InputMaybe<OrderBy>;
};

/** aggregate stddevPop on columns */
export type workSchedulesStddevPopFields = {
  __typename?: 'workSchedulesStddevPopFields';
  /** Number of hours worked on this day */
  workHours?: Maybe<Scalars['Float']['output']>;
};

/** order by stddevPop() on columns of table "work_schedule" */
export type workSchedulesStddevPopOrderBy = {
  /** Number of hours worked on this day */
  workHours?: InputMaybe<OrderBy>;
};

/** aggregate stddevSamp on columns */
export type workSchedulesStddevSampFields = {
  __typename?: 'workSchedulesStddevSampFields';
  /** Number of hours worked on this day */
  workHours?: Maybe<Scalars['Float']['output']>;
};

/** order by stddevSamp() on columns of table "work_schedule" */
export type workSchedulesStddevSampOrderBy = {
  /** Number of hours worked on this day */
  workHours?: InputMaybe<OrderBy>;
};

/** Streaming cursor of the table "workSchedules" */
export type workSchedulesStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: workSchedulesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type workSchedulesStreamCursorValueInput = {
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
export type workSchedulesSumFields = {
  __typename?: 'workSchedulesSumFields';
  /** Number of hours worked on this day */
  workHours?: Maybe<Scalars['numeric']['output']>;
};

/** order by sum() on columns of table "work_schedule" */
export type workSchedulesSumOrderBy = {
  /** Number of hours worked on this day */
  workHours?: InputMaybe<OrderBy>;
};

/** update columns of table "work_schedule" */
export type workSchedulesUpdateColumn =
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
  | 'workHours';

export type workSchedulesUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<workSchedulesIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<workSchedulesSetInput>;
  /** filter the rows which have to be updated */
  where: workSchedulesBoolExp;
};

/** aggregate varPop on columns */
export type workSchedulesVarPopFields = {
  __typename?: 'workSchedulesVarPopFields';
  /** Number of hours worked on this day */
  workHours?: Maybe<Scalars['Float']['output']>;
};

/** order by varPop() on columns of table "work_schedule" */
export type workSchedulesVarPopOrderBy = {
  /** Number of hours worked on this day */
  workHours?: InputMaybe<OrderBy>;
};

/** aggregate varSamp on columns */
export type workSchedulesVarSampFields = {
  __typename?: 'workSchedulesVarSampFields';
  /** Number of hours worked on this day */
  workHours?: Maybe<Scalars['Float']['output']>;
};

/** order by varSamp() on columns of table "work_schedule" */
export type workSchedulesVarSampOrderBy = {
  /** Number of hours worked on this day */
  workHours?: InputMaybe<OrderBy>;
};

/** aggregate variance on columns */
export type workSchedulesVarianceFields = {
  __typename?: 'workSchedulesVarianceFields';
  /** Number of hours worked on this day */
  workHours?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "work_schedule" */
export type workSchedulesVarianceOrderBy = {
  /** Number of hours worked on this day */
  workHours?: InputMaybe<OrderBy>;
};
