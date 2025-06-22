export type Maybe<T> = T | null | undefined;
export type InputMaybe<T> = T | null | undefined;
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
  _Any: { input: any; output: any };
  bpchar: { input: string; output: string };
  date: { input: string; output: string };
  jsonb: { input: any; output: any };
  leave_status_enum: { input: any; output: any };
  numeric: { input: number; output: number };
  payroll_cycle_type: { input: any; output: any };
  payroll_date_type: { input: any; output: any };
  payroll_status: { input: any; output: any };
  permission_action: { input: any; output: any };
  timestamp: { input: string; output: string };
  timestamptz: { input: string; output: string };
  user_role: { input: any; output: any };
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

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
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

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
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
export type String_Array_Comparison_Exp = {
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
export type String_Comparison_Exp = {
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

/** A union of all types that use the @key directive */
export type _Entity =
  | Adjustment_Rules
  | Client_External_Systems
  | Clients
  | External_Systems
  | Holidays
  | Leave
  | Notes
  | Payroll_Cycles
  | Payroll_Date_Types
  | Payroll_Dates
  | Payrolls
  | Users
  | Work_Schedule;

export type _Service = {
  __typename: "_Service";
  /** SDL representation of schema */
  sdl: Scalars["String"]["output"];
};

/** columns and relationships of "adjustment_rules" */
export type Adjustment_Rules = {
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
  payroll_cycle: Payroll_Cycles;
  /** An object relationship */
  payroll_date_type: Payroll_Date_Types;
  /** Code/formula used to calculate date adjustments */
  rule_code: Scalars["String"]["output"];
  /** Human-readable description of the adjustment rule */
  rule_description: Scalars["String"]["output"];
  /** Timestamp when the rule was last updated */
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
};

/** aggregated selection of "adjustment_rules" */
export type Adjustment_Rules_Aggregate = {
  __typename: "adjustment_rules_aggregate";
  aggregate: Maybe<Adjustment_Rules_Aggregate_Fields>;
  nodes: Array<Adjustment_Rules>;
};

export type Adjustment_Rules_Aggregate_Bool_Exp = {
  count?: InputMaybe<Adjustment_Rules_Aggregate_Bool_Exp_Count>;
};

export type Adjustment_Rules_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Adjustment_Rules_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Adjustment_Rules_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "adjustment_rules" */
export type Adjustment_Rules_Aggregate_Fields = {
  __typename: "adjustment_rules_aggregate_fields";
  count: Scalars["Int"]["output"];
  max: Maybe<Adjustment_Rules_Max_Fields>;
  min: Maybe<Adjustment_Rules_Min_Fields>;
};

/** aggregate fields of "adjustment_rules" */
export type Adjustment_Rules_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Adjustment_Rules_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "adjustment_rules" */
export type Adjustment_Rules_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Adjustment_Rules_Max_Order_By>;
  min?: InputMaybe<Adjustment_Rules_Min_Order_By>;
};

/** input type for inserting array relation for remote table "adjustment_rules" */
export type Adjustment_Rules_Arr_Rel_Insert_Input = {
  data: Array<Adjustment_Rules_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Adjustment_Rules_On_Conflict>;
};

/** Boolean expression to filter rows from the table "adjustment_rules". All fields are combined with a logical 'AND'. */
export type Adjustment_Rules_Bool_Exp = {
  _and?: InputMaybe<Array<Adjustment_Rules_Bool_Exp>>;
  _not?: InputMaybe<Adjustment_Rules_Bool_Exp>;
  _or?: InputMaybe<Array<Adjustment_Rules_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  cycle_id?: InputMaybe<Uuid_Comparison_Exp>;
  date_type_id?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  payroll_cycle?: InputMaybe<Payroll_Cycles_Bool_Exp>;
  payroll_date_type?: InputMaybe<Payroll_Date_Types_Bool_Exp>;
  rule_code?: InputMaybe<String_Comparison_Exp>;
  rule_description?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "adjustment_rules" */
export type Adjustment_Rules_Constraint =
  /** unique or primary key constraint on columns "date_type_id", "cycle_id" */
  | "adjustment_rules_cycle_id_date_type_id_key"
  /** unique or primary key constraint on columns "id" */
  | "adjustment_rules_pkey";

/** input type for inserting data into table "adjustment_rules" */
export type Adjustment_Rules_Insert_Input = {
  /** Timestamp when the rule was created */
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  /** Reference to the payroll cycle this rule applies to */
  cycle_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Reference to the payroll date type this rule affects */
  date_type_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Unique identifier for the adjustment rule */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  payroll_cycle?: InputMaybe<Payroll_Cycles_Obj_Rel_Insert_Input>;
  payroll_date_type?: InputMaybe<Payroll_Date_Types_Obj_Rel_Insert_Input>;
  /** Code/formula used to calculate date adjustments */
  rule_code?: InputMaybe<Scalars["String"]["input"]>;
  /** Human-readable description of the adjustment rule */
  rule_description?: InputMaybe<Scalars["String"]["input"]>;
  /** Timestamp when the rule was last updated */
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** aggregate max on columns */
export type Adjustment_Rules_Max_Fields = {
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
export type Adjustment_Rules_Max_Order_By = {
  /** Timestamp when the rule was created */
  created_at?: InputMaybe<Order_By>;
  /** Reference to the payroll cycle this rule applies to */
  cycle_id?: InputMaybe<Order_By>;
  /** Reference to the payroll date type this rule affects */
  date_type_id?: InputMaybe<Order_By>;
  /** Unique identifier for the adjustment rule */
  id?: InputMaybe<Order_By>;
  /** Code/formula used to calculate date adjustments */
  rule_code?: InputMaybe<Order_By>;
  /** Human-readable description of the adjustment rule */
  rule_description?: InputMaybe<Order_By>;
  /** Timestamp when the rule was last updated */
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Adjustment_Rules_Min_Fields = {
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
export type Adjustment_Rules_Min_Order_By = {
  /** Timestamp when the rule was created */
  created_at?: InputMaybe<Order_By>;
  /** Reference to the payroll cycle this rule applies to */
  cycle_id?: InputMaybe<Order_By>;
  /** Reference to the payroll date type this rule affects */
  date_type_id?: InputMaybe<Order_By>;
  /** Unique identifier for the adjustment rule */
  id?: InputMaybe<Order_By>;
  /** Code/formula used to calculate date adjustments */
  rule_code?: InputMaybe<Order_By>;
  /** Human-readable description of the adjustment rule */
  rule_description?: InputMaybe<Order_By>;
  /** Timestamp when the rule was last updated */
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "adjustment_rules" */
export type Adjustment_Rules_Mutation_Response = {
  __typename: "adjustment_rules_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Adjustment_Rules>;
};

/** on_conflict condition type for table "adjustment_rules" */
export type Adjustment_Rules_On_Conflict = {
  constraint: Adjustment_Rules_Constraint;
  update_columns?: Array<Adjustment_Rules_Update_Column>;
  where?: InputMaybe<Adjustment_Rules_Bool_Exp>;
};

/** Ordering options when selecting data from "adjustment_rules". */
export type Adjustment_Rules_Order_By = {
  created_at?: InputMaybe<Order_By>;
  cycle_id?: InputMaybe<Order_By>;
  date_type_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  payroll_cycle?: InputMaybe<Payroll_Cycles_Order_By>;
  payroll_date_type?: InputMaybe<Payroll_Date_Types_Order_By>;
  rule_code?: InputMaybe<Order_By>;
  rule_description?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: adjustment_rules */
export type Adjustment_Rules_Pk_Columns_Input = {
  /** Unique identifier for the adjustment rule */
  id: Scalars["uuid"]["input"];
};

/** select columns of table "adjustment_rules" */
export type Adjustment_Rules_Select_Column =
  /** column name */
  | "created_at"
  /** column name */
  | "cycle_id"
  /** column name */
  | "date_type_id"
  /** column name */
  | "id"
  /** column name */
  | "rule_code"
  /** column name */
  | "rule_description"
  /** column name */
  | "updated_at";

/** input type for updating data in table "adjustment_rules" */
export type Adjustment_Rules_Set_Input = {
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
export type Adjustment_Rules_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Adjustment_Rules_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Adjustment_Rules_Stream_Cursor_Value_Input = {
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
export type Adjustment_Rules_Update_Column =
  /** column name */
  | "created_at"
  /** column name */
  | "cycle_id"
  /** column name */
  | "date_type_id"
  /** column name */
  | "id"
  /** column name */
  | "rule_code"
  /** column name */
  | "rule_description"
  /** column name */
  | "updated_at";

export type Adjustment_Rules_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Adjustment_Rules_Set_Input>;
  /** filter the rows which have to be updated */
  where: Adjustment_Rules_Bool_Exp;
};

/** columns and relationships of "app_settings" */
export type App_Settings = {
  __typename: "app_settings";
  /** Unique identifier for application setting */
  id: Scalars["String"]["output"];
  /** JSON structure containing application permission configurations */
  permissions: Maybe<Scalars["jsonb"]["output"]>;
};

/** columns and relationships of "app_settings" */
export type App_SettingsPermissionsArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregated selection of "app_settings" */
export type App_Settings_Aggregate = {
  __typename: "app_settings_aggregate";
  aggregate: Maybe<App_Settings_Aggregate_Fields>;
  nodes: Array<App_Settings>;
};

/** aggregate fields of "app_settings" */
export type App_Settings_Aggregate_Fields = {
  __typename: "app_settings_aggregate_fields";
  count: Scalars["Int"]["output"];
  max: Maybe<App_Settings_Max_Fields>;
  min: Maybe<App_Settings_Min_Fields>;
};

/** aggregate fields of "app_settings" */
export type App_Settings_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<App_Settings_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type App_Settings_Append_Input = {
  /** JSON structure containing application permission configurations */
  permissions?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** Boolean expression to filter rows from the table "app_settings". All fields are combined with a logical 'AND'. */
export type App_Settings_Bool_Exp = {
  _and?: InputMaybe<Array<App_Settings_Bool_Exp>>;
  _not?: InputMaybe<App_Settings_Bool_Exp>;
  _or?: InputMaybe<Array<App_Settings_Bool_Exp>>;
  id?: InputMaybe<String_Comparison_Exp>;
  permissions?: InputMaybe<Jsonb_Comparison_Exp>;
};

/** unique or primary key constraints on table "app_settings" */
export type App_Settings_Constraint =
  /** unique or primary key constraint on columns "id" */
  "app_settings_pkey";

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type App_Settings_Delete_At_Path_Input = {
  /** JSON structure containing application permission configurations */
  permissions?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type App_Settings_Delete_Elem_Input = {
  /** JSON structure containing application permission configurations */
  permissions?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type App_Settings_Delete_Key_Input = {
  /** JSON structure containing application permission configurations */
  permissions?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for inserting data into table "app_settings" */
export type App_Settings_Insert_Input = {
  /** Unique identifier for application setting */
  id?: InputMaybe<Scalars["String"]["input"]>;
  /** JSON structure containing application permission configurations */
  permissions?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** aggregate max on columns */
export type App_Settings_Max_Fields = {
  __typename: "app_settings_max_fields";
  /** Unique identifier for application setting */
  id: Maybe<Scalars["String"]["output"]>;
};

/** aggregate min on columns */
export type App_Settings_Min_Fields = {
  __typename: "app_settings_min_fields";
  /** Unique identifier for application setting */
  id: Maybe<Scalars["String"]["output"]>;
};

/** response of any mutation on the table "app_settings" */
export type App_Settings_Mutation_Response = {
  __typename: "app_settings_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<App_Settings>;
};

/** on_conflict condition type for table "app_settings" */
export type App_Settings_On_Conflict = {
  constraint: App_Settings_Constraint;
  update_columns?: Array<App_Settings_Update_Column>;
  where?: InputMaybe<App_Settings_Bool_Exp>;
};

/** Ordering options when selecting data from "app_settings". */
export type App_Settings_Order_By = {
  id?: InputMaybe<Order_By>;
  permissions?: InputMaybe<Order_By>;
};

/** primary key columns input for table: app_settings */
export type App_Settings_Pk_Columns_Input = {
  /** Unique identifier for application setting */
  id: Scalars["String"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type App_Settings_Prepend_Input = {
  /** JSON structure containing application permission configurations */
  permissions?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "app_settings" */
export type App_Settings_Select_Column =
  /** column name */
  | "id"
  /** column name */
  | "permissions";

/** input type for updating data in table "app_settings" */
export type App_Settings_Set_Input = {
  /** Unique identifier for application setting */
  id?: InputMaybe<Scalars["String"]["input"]>;
  /** JSON structure containing application permission configurations */
  permissions?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** Streaming cursor of the table "app_settings" */
export type App_Settings_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: App_Settings_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type App_Settings_Stream_Cursor_Value_Input = {
  /** Unique identifier for application setting */
  id?: InputMaybe<Scalars["String"]["input"]>;
  /** JSON structure containing application permission configurations */
  permissions?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** update columns of table "app_settings" */
export type App_Settings_Update_Column =
  /** column name */
  | "id"
  /** column name */
  | "permissions";

export type App_Settings_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<App_Settings_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<App_Settings_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<App_Settings_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<App_Settings_Delete_Key_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<App_Settings_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<App_Settings_Set_Input>;
  /** filter the rows which have to be updated */
  where: App_Settings_Bool_Exp;
};

/** columns and relationships of "billing_event_log" */
export type Billing_Event_Log = {
  __typename: "billing_event_log";
  /** An object relationship */
  billing_invoice: Maybe<Billing_Invoice>;
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
export type Billing_Event_Log_Aggregate = {
  __typename: "billing_event_log_aggregate";
  aggregate: Maybe<Billing_Event_Log_Aggregate_Fields>;
  nodes: Array<Billing_Event_Log>;
};

export type Billing_Event_Log_Aggregate_Bool_Exp = {
  count?: InputMaybe<Billing_Event_Log_Aggregate_Bool_Exp_Count>;
};

export type Billing_Event_Log_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Billing_Event_Log_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Billing_Event_Log_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "billing_event_log" */
export type Billing_Event_Log_Aggregate_Fields = {
  __typename: "billing_event_log_aggregate_fields";
  count: Scalars["Int"]["output"];
  max: Maybe<Billing_Event_Log_Max_Fields>;
  min: Maybe<Billing_Event_Log_Min_Fields>;
};

/** aggregate fields of "billing_event_log" */
export type Billing_Event_Log_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Billing_Event_Log_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "billing_event_log" */
export type Billing_Event_Log_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Billing_Event_Log_Max_Order_By>;
  min?: InputMaybe<Billing_Event_Log_Min_Order_By>;
};

/** input type for inserting array relation for remote table "billing_event_log" */
export type Billing_Event_Log_Arr_Rel_Insert_Input = {
  data: Array<Billing_Event_Log_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Billing_Event_Log_On_Conflict>;
};

/** Boolean expression to filter rows from the table "billing_event_log". All fields are combined with a logical 'AND'. */
export type Billing_Event_Log_Bool_Exp = {
  _and?: InputMaybe<Array<Billing_Event_Log_Bool_Exp>>;
  _not?: InputMaybe<Billing_Event_Log_Bool_Exp>;
  _or?: InputMaybe<Array<Billing_Event_Log_Bool_Exp>>;
  billing_invoice?: InputMaybe<Billing_Invoice_Bool_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  created_by?: InputMaybe<Uuid_Comparison_Exp>;
  event_type?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  invoice_id?: InputMaybe<Uuid_Comparison_Exp>;
  message?: InputMaybe<String_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
};

/** unique or primary key constraints on table "billing_event_log" */
export type Billing_Event_Log_Constraint =
  /** unique or primary key constraint on columns "id" */
  "billing_event_log_pkey";

/** input type for inserting data into table "billing_event_log" */
export type Billing_Event_Log_Insert_Input = {
  billing_invoice?: InputMaybe<Billing_Invoice_Obj_Rel_Insert_Input>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  created_by?: InputMaybe<Scalars["uuid"]["input"]>;
  event_type?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  invoice_id?: InputMaybe<Scalars["uuid"]["input"]>;
  message?: InputMaybe<Scalars["String"]["input"]>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Billing_Event_Log_Max_Fields = {
  __typename: "billing_event_log_max_fields";
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  created_by: Maybe<Scalars["uuid"]["output"]>;
  event_type: Maybe<Scalars["String"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  invoice_id: Maybe<Scalars["uuid"]["output"]>;
  message: Maybe<Scalars["String"]["output"]>;
};

/** order by max() on columns of table "billing_event_log" */
export type Billing_Event_Log_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  event_type?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  invoice_id?: InputMaybe<Order_By>;
  message?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Billing_Event_Log_Min_Fields = {
  __typename: "billing_event_log_min_fields";
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  created_by: Maybe<Scalars["uuid"]["output"]>;
  event_type: Maybe<Scalars["String"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  invoice_id: Maybe<Scalars["uuid"]["output"]>;
  message: Maybe<Scalars["String"]["output"]>;
};

/** order by min() on columns of table "billing_event_log" */
export type Billing_Event_Log_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  event_type?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  invoice_id?: InputMaybe<Order_By>;
  message?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "billing_event_log" */
export type Billing_Event_Log_Mutation_Response = {
  __typename: "billing_event_log_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Billing_Event_Log>;
};

/** on_conflict condition type for table "billing_event_log" */
export type Billing_Event_Log_On_Conflict = {
  constraint: Billing_Event_Log_Constraint;
  update_columns?: Array<Billing_Event_Log_Update_Column>;
  where?: InputMaybe<Billing_Event_Log_Bool_Exp>;
};

/** Ordering options when selecting data from "billing_event_log". */
export type Billing_Event_Log_Order_By = {
  billing_invoice?: InputMaybe<Billing_Invoice_Order_By>;
  created_at?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  event_type?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  invoice_id?: InputMaybe<Order_By>;
  message?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
};

/** primary key columns input for table: billing_event_log */
export type Billing_Event_Log_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "billing_event_log" */
export type Billing_Event_Log_Select_Column =
  /** column name */
  | "created_at"
  /** column name */
  | "created_by"
  /** column name */
  | "event_type"
  /** column name */
  | "id"
  /** column name */
  | "invoice_id"
  /** column name */
  | "message";

/** input type for updating data in table "billing_event_log" */
export type Billing_Event_Log_Set_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  created_by?: InputMaybe<Scalars["uuid"]["input"]>;
  event_type?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  invoice_id?: InputMaybe<Scalars["uuid"]["input"]>;
  message?: InputMaybe<Scalars["String"]["input"]>;
};

/** Streaming cursor of the table "billing_event_log" */
export type Billing_Event_Log_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Billing_Event_Log_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Billing_Event_Log_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  created_by?: InputMaybe<Scalars["uuid"]["input"]>;
  event_type?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  invoice_id?: InputMaybe<Scalars["uuid"]["input"]>;
  message?: InputMaybe<Scalars["String"]["input"]>;
};

/** update columns of table "billing_event_log" */
export type Billing_Event_Log_Update_Column =
  /** column name */
  | "created_at"
  /** column name */
  | "created_by"
  /** column name */
  | "event_type"
  /** column name */
  | "id"
  /** column name */
  | "invoice_id"
  /** column name */
  | "message";

export type Billing_Event_Log_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Billing_Event_Log_Set_Input>;
  /** filter the rows which have to be updated */
  where: Billing_Event_Log_Bool_Exp;
};

/** columns and relationships of "billing_invoice" */
export type Billing_Invoice = {
  __typename: "billing_invoice";
  /** An array relationship */
  billing_event_logs: Array<Billing_Event_Log>;
  /** An aggregate relationship */
  billing_event_logs_aggregate: Billing_Event_Log_Aggregate;
  /** An array relationship */
  billing_invoice_items: Array<Billing_Invoice_Item>;
  /** An aggregate relationship */
  billing_invoice_items_aggregate: Billing_Invoice_Item_Aggregate;
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
export type Billing_InvoiceBilling_Event_LogsArgs = {
  distinct_on?: InputMaybe<Array<Billing_Event_Log_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Billing_Event_Log_Order_By>>;
  where?: InputMaybe<Billing_Event_Log_Bool_Exp>;
};

/** columns and relationships of "billing_invoice" */
export type Billing_InvoiceBilling_Event_Logs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Billing_Event_Log_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Billing_Event_Log_Order_By>>;
  where?: InputMaybe<Billing_Event_Log_Bool_Exp>;
};

/** columns and relationships of "billing_invoice" */
export type Billing_InvoiceBilling_Invoice_ItemsArgs = {
  distinct_on?: InputMaybe<Array<Billing_Invoice_Item_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Billing_Invoice_Item_Order_By>>;
  where?: InputMaybe<Billing_Invoice_Item_Bool_Exp>;
};

/** columns and relationships of "billing_invoice" */
export type Billing_InvoiceBilling_Invoice_Items_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Billing_Invoice_Item_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Billing_Invoice_Item_Order_By>>;
  where?: InputMaybe<Billing_Invoice_Item_Bool_Exp>;
};

/** aggregated selection of "billing_invoice" */
export type Billing_Invoice_Aggregate = {
  __typename: "billing_invoice_aggregate";
  aggregate: Maybe<Billing_Invoice_Aggregate_Fields>;
  nodes: Array<Billing_Invoice>;
};

export type Billing_Invoice_Aggregate_Bool_Exp = {
  count?: InputMaybe<Billing_Invoice_Aggregate_Bool_Exp_Count>;
};

export type Billing_Invoice_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Billing_Invoice_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Billing_Invoice_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "billing_invoice" */
export type Billing_Invoice_Aggregate_Fields = {
  __typename: "billing_invoice_aggregate_fields";
  avg: Maybe<Billing_Invoice_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max: Maybe<Billing_Invoice_Max_Fields>;
  min: Maybe<Billing_Invoice_Min_Fields>;
  stddev: Maybe<Billing_Invoice_Stddev_Fields>;
  stddev_pop: Maybe<Billing_Invoice_Stddev_Pop_Fields>;
  stddev_samp: Maybe<Billing_Invoice_Stddev_Samp_Fields>;
  sum: Maybe<Billing_Invoice_Sum_Fields>;
  var_pop: Maybe<Billing_Invoice_Var_Pop_Fields>;
  var_samp: Maybe<Billing_Invoice_Var_Samp_Fields>;
  variance: Maybe<Billing_Invoice_Variance_Fields>;
};

/** aggregate fields of "billing_invoice" */
export type Billing_Invoice_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Billing_Invoice_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "billing_invoice" */
export type Billing_Invoice_Aggregate_Order_By = {
  avg?: InputMaybe<Billing_Invoice_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Billing_Invoice_Max_Order_By>;
  min?: InputMaybe<Billing_Invoice_Min_Order_By>;
  stddev?: InputMaybe<Billing_Invoice_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Billing_Invoice_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Billing_Invoice_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Billing_Invoice_Sum_Order_By>;
  var_pop?: InputMaybe<Billing_Invoice_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Billing_Invoice_Var_Samp_Order_By>;
  variance?: InputMaybe<Billing_Invoice_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "billing_invoice" */
export type Billing_Invoice_Arr_Rel_Insert_Input = {
  data: Array<Billing_Invoice_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Billing_Invoice_On_Conflict>;
};

/** aggregate avg on columns */
export type Billing_Invoice_Avg_Fields = {
  __typename: "billing_invoice_avg_fields";
  total_amount: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "billing_invoice" */
export type Billing_Invoice_Avg_Order_By = {
  total_amount?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "billing_invoice". All fields are combined with a logical 'AND'. */
export type Billing_Invoice_Bool_Exp = {
  _and?: InputMaybe<Array<Billing_Invoice_Bool_Exp>>;
  _not?: InputMaybe<Billing_Invoice_Bool_Exp>;
  _or?: InputMaybe<Array<Billing_Invoice_Bool_Exp>>;
  billing_event_logs?: InputMaybe<Billing_Event_Log_Bool_Exp>;
  billing_event_logs_aggregate?: InputMaybe<Billing_Event_Log_Aggregate_Bool_Exp>;
  billing_invoice_items?: InputMaybe<Billing_Invoice_Item_Bool_Exp>;
  billing_invoice_items_aggregate?: InputMaybe<Billing_Invoice_Item_Aggregate_Bool_Exp>;
  billing_period_end?: InputMaybe<Date_Comparison_Exp>;
  billing_period_start?: InputMaybe<Date_Comparison_Exp>;
  client?: InputMaybe<Clients_Bool_Exp>;
  client_id?: InputMaybe<Uuid_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  currency?: InputMaybe<String_Comparison_Exp>;
  due_date?: InputMaybe<Date_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  issued_date?: InputMaybe<Date_Comparison_Exp>;
  notes?: InputMaybe<String_Comparison_Exp>;
  status?: InputMaybe<String_Comparison_Exp>;
  total_amount?: InputMaybe<Numeric_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "billing_invoice" */
export type Billing_Invoice_Constraint =
  /** unique or primary key constraint on columns "id" */
  "billing_invoice_pkey";

/** input type for incrementing numeric columns in table "billing_invoice" */
export type Billing_Invoice_Inc_Input = {
  total_amount?: InputMaybe<Scalars["numeric"]["input"]>;
};

/** input type for inserting data into table "billing_invoice" */
export type Billing_Invoice_Insert_Input = {
  billing_event_logs?: InputMaybe<Billing_Event_Log_Arr_Rel_Insert_Input>;
  billing_invoice_items?: InputMaybe<Billing_Invoice_Item_Arr_Rel_Insert_Input>;
  billing_period_end?: InputMaybe<Scalars["date"]["input"]>;
  billing_period_start?: InputMaybe<Scalars["date"]["input"]>;
  client?: InputMaybe<Clients_Obj_Rel_Insert_Input>;
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
export type Billing_Invoice_Item = {
  __typename: "billing_invoice_item";
  amount: Maybe<Scalars["numeric"]["output"]>;
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  description: Scalars["String"]["output"];
  id: Scalars["uuid"]["output"];
  invoice_id: Scalars["uuid"]["output"];
  /** An object relationship */
  parent_invoice: Billing_Invoice;
  quantity: Scalars["Int"]["output"];
  unit_price: Scalars["numeric"]["output"];
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
};

/** aggregated selection of "billing_invoice_item" */
export type Billing_Invoice_Item_Aggregate = {
  __typename: "billing_invoice_item_aggregate";
  aggregate: Maybe<Billing_Invoice_Item_Aggregate_Fields>;
  nodes: Array<Billing_Invoice_Item>;
};

export type Billing_Invoice_Item_Aggregate_Bool_Exp = {
  count?: InputMaybe<Billing_Invoice_Item_Aggregate_Bool_Exp_Count>;
};

export type Billing_Invoice_Item_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Billing_Invoice_Item_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Billing_Invoice_Item_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "billing_invoice_item" */
export type Billing_Invoice_Item_Aggregate_Fields = {
  __typename: "billing_invoice_item_aggregate_fields";
  avg: Maybe<Billing_Invoice_Item_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max: Maybe<Billing_Invoice_Item_Max_Fields>;
  min: Maybe<Billing_Invoice_Item_Min_Fields>;
  stddev: Maybe<Billing_Invoice_Item_Stddev_Fields>;
  stddev_pop: Maybe<Billing_Invoice_Item_Stddev_Pop_Fields>;
  stddev_samp: Maybe<Billing_Invoice_Item_Stddev_Samp_Fields>;
  sum: Maybe<Billing_Invoice_Item_Sum_Fields>;
  var_pop: Maybe<Billing_Invoice_Item_Var_Pop_Fields>;
  var_samp: Maybe<Billing_Invoice_Item_Var_Samp_Fields>;
  variance: Maybe<Billing_Invoice_Item_Variance_Fields>;
};

/** aggregate fields of "billing_invoice_item" */
export type Billing_Invoice_Item_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Billing_Invoice_Item_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "billing_invoice_item" */
export type Billing_Invoice_Item_Aggregate_Order_By = {
  avg?: InputMaybe<Billing_Invoice_Item_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Billing_Invoice_Item_Max_Order_By>;
  min?: InputMaybe<Billing_Invoice_Item_Min_Order_By>;
  stddev?: InputMaybe<Billing_Invoice_Item_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Billing_Invoice_Item_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Billing_Invoice_Item_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Billing_Invoice_Item_Sum_Order_By>;
  var_pop?: InputMaybe<Billing_Invoice_Item_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Billing_Invoice_Item_Var_Samp_Order_By>;
  variance?: InputMaybe<Billing_Invoice_Item_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "billing_invoice_item" */
export type Billing_Invoice_Item_Arr_Rel_Insert_Input = {
  data: Array<Billing_Invoice_Item_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Billing_Invoice_Item_On_Conflict>;
};

/** aggregate avg on columns */
export type Billing_Invoice_Item_Avg_Fields = {
  __typename: "billing_invoice_item_avg_fields";
  amount: Maybe<Scalars["Float"]["output"]>;
  quantity: Maybe<Scalars["Float"]["output"]>;
  unit_price: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "billing_invoice_item" */
export type Billing_Invoice_Item_Avg_Order_By = {
  amount?: InputMaybe<Order_By>;
  quantity?: InputMaybe<Order_By>;
  unit_price?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "billing_invoice_item". All fields are combined with a logical 'AND'. */
export type Billing_Invoice_Item_Bool_Exp = {
  _and?: InputMaybe<Array<Billing_Invoice_Item_Bool_Exp>>;
  _not?: InputMaybe<Billing_Invoice_Item_Bool_Exp>;
  _or?: InputMaybe<Array<Billing_Invoice_Item_Bool_Exp>>;
  amount?: InputMaybe<Numeric_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  invoice_id?: InputMaybe<Uuid_Comparison_Exp>;
  parent_invoice?: InputMaybe<Billing_Invoice_Bool_Exp>;
  quantity?: InputMaybe<Int_Comparison_Exp>;
  unit_price?: InputMaybe<Numeric_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "billing_invoice_item" */
export type Billing_Invoice_Item_Constraint =
  /** unique or primary key constraint on columns "id" */
  "billing_invoice_item_pkey";

/** input type for incrementing numeric columns in table "billing_invoice_item" */
export type Billing_Invoice_Item_Inc_Input = {
  quantity?: InputMaybe<Scalars["Int"]["input"]>;
  unit_price?: InputMaybe<Scalars["numeric"]["input"]>;
};

/** input type for inserting data into table "billing_invoice_item" */
export type Billing_Invoice_Item_Insert_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  invoice_id?: InputMaybe<Scalars["uuid"]["input"]>;
  parent_invoice?: InputMaybe<Billing_Invoice_Obj_Rel_Insert_Input>;
  quantity?: InputMaybe<Scalars["Int"]["input"]>;
  unit_price?: InputMaybe<Scalars["numeric"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** aggregate max on columns */
export type Billing_Invoice_Item_Max_Fields = {
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
export type Billing_Invoice_Item_Max_Order_By = {
  amount?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  invoice_id?: InputMaybe<Order_By>;
  quantity?: InputMaybe<Order_By>;
  unit_price?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Billing_Invoice_Item_Min_Fields = {
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
export type Billing_Invoice_Item_Min_Order_By = {
  amount?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  invoice_id?: InputMaybe<Order_By>;
  quantity?: InputMaybe<Order_By>;
  unit_price?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "billing_invoice_item" */
export type Billing_Invoice_Item_Mutation_Response = {
  __typename: "billing_invoice_item_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Billing_Invoice_Item>;
};

/** on_conflict condition type for table "billing_invoice_item" */
export type Billing_Invoice_Item_On_Conflict = {
  constraint: Billing_Invoice_Item_Constraint;
  update_columns?: Array<Billing_Invoice_Item_Update_Column>;
  where?: InputMaybe<Billing_Invoice_Item_Bool_Exp>;
};

/** Ordering options when selecting data from "billing_invoice_item". */
export type Billing_Invoice_Item_Order_By = {
  amount?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  invoice_id?: InputMaybe<Order_By>;
  parent_invoice?: InputMaybe<Billing_Invoice_Order_By>;
  quantity?: InputMaybe<Order_By>;
  unit_price?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: billing_invoice_item */
export type Billing_Invoice_Item_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "billing_invoice_item" */
export type Billing_Invoice_Item_Select_Column =
  /** column name */
  | "amount"
  /** column name */
  | "created_at"
  /** column name */
  | "description"
  /** column name */
  | "id"
  /** column name */
  | "invoice_id"
  /** column name */
  | "quantity"
  /** column name */
  | "unit_price"
  /** column name */
  | "updated_at";

/** input type for updating data in table "billing_invoice_item" */
export type Billing_Invoice_Item_Set_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  invoice_id?: InputMaybe<Scalars["uuid"]["input"]>;
  quantity?: InputMaybe<Scalars["Int"]["input"]>;
  unit_price?: InputMaybe<Scalars["numeric"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** aggregate stddev on columns */
export type Billing_Invoice_Item_Stddev_Fields = {
  __typename: "billing_invoice_item_stddev_fields";
  amount: Maybe<Scalars["Float"]["output"]>;
  quantity: Maybe<Scalars["Float"]["output"]>;
  unit_price: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "billing_invoice_item" */
export type Billing_Invoice_Item_Stddev_Order_By = {
  amount?: InputMaybe<Order_By>;
  quantity?: InputMaybe<Order_By>;
  unit_price?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Billing_Invoice_Item_Stddev_Pop_Fields = {
  __typename: "billing_invoice_item_stddev_pop_fields";
  amount: Maybe<Scalars["Float"]["output"]>;
  quantity: Maybe<Scalars["Float"]["output"]>;
  unit_price: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "billing_invoice_item" */
export type Billing_Invoice_Item_Stddev_Pop_Order_By = {
  amount?: InputMaybe<Order_By>;
  quantity?: InputMaybe<Order_By>;
  unit_price?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Billing_Invoice_Item_Stddev_Samp_Fields = {
  __typename: "billing_invoice_item_stddev_samp_fields";
  amount: Maybe<Scalars["Float"]["output"]>;
  quantity: Maybe<Scalars["Float"]["output"]>;
  unit_price: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "billing_invoice_item" */
export type Billing_Invoice_Item_Stddev_Samp_Order_By = {
  amount?: InputMaybe<Order_By>;
  quantity?: InputMaybe<Order_By>;
  unit_price?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "billing_invoice_item" */
export type Billing_Invoice_Item_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Billing_Invoice_Item_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Billing_Invoice_Item_Stream_Cursor_Value_Input = {
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
export type Billing_Invoice_Item_Sum_Fields = {
  __typename: "billing_invoice_item_sum_fields";
  amount: Maybe<Scalars["numeric"]["output"]>;
  quantity: Maybe<Scalars["Int"]["output"]>;
  unit_price: Maybe<Scalars["numeric"]["output"]>;
};

/** order by sum() on columns of table "billing_invoice_item" */
export type Billing_Invoice_Item_Sum_Order_By = {
  amount?: InputMaybe<Order_By>;
  quantity?: InputMaybe<Order_By>;
  unit_price?: InputMaybe<Order_By>;
};

/** update columns of table "billing_invoice_item" */
export type Billing_Invoice_Item_Update_Column =
  /** column name */
  | "created_at"
  /** column name */
  | "description"
  /** column name */
  | "id"
  /** column name */
  | "invoice_id"
  /** column name */
  | "quantity"
  /** column name */
  | "unit_price"
  /** column name */
  | "updated_at";

export type Billing_Invoice_Item_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Billing_Invoice_Item_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Billing_Invoice_Item_Set_Input>;
  /** filter the rows which have to be updated */
  where: Billing_Invoice_Item_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Billing_Invoice_Item_Var_Pop_Fields = {
  __typename: "billing_invoice_item_var_pop_fields";
  amount: Maybe<Scalars["Float"]["output"]>;
  quantity: Maybe<Scalars["Float"]["output"]>;
  unit_price: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "billing_invoice_item" */
export type Billing_Invoice_Item_Var_Pop_Order_By = {
  amount?: InputMaybe<Order_By>;
  quantity?: InputMaybe<Order_By>;
  unit_price?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Billing_Invoice_Item_Var_Samp_Fields = {
  __typename: "billing_invoice_item_var_samp_fields";
  amount: Maybe<Scalars["Float"]["output"]>;
  quantity: Maybe<Scalars["Float"]["output"]>;
  unit_price: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "billing_invoice_item" */
export type Billing_Invoice_Item_Var_Samp_Order_By = {
  amount?: InputMaybe<Order_By>;
  quantity?: InputMaybe<Order_By>;
  unit_price?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Billing_Invoice_Item_Variance_Fields = {
  __typename: "billing_invoice_item_variance_fields";
  amount: Maybe<Scalars["Float"]["output"]>;
  quantity: Maybe<Scalars["Float"]["output"]>;
  unit_price: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "billing_invoice_item" */
export type Billing_Invoice_Item_Variance_Order_By = {
  amount?: InputMaybe<Order_By>;
  quantity?: InputMaybe<Order_By>;
  unit_price?: InputMaybe<Order_By>;
};

/** aggregate max on columns */
export type Billing_Invoice_Max_Fields = {
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
export type Billing_Invoice_Max_Order_By = {
  billing_period_end?: InputMaybe<Order_By>;
  billing_period_start?: InputMaybe<Order_By>;
  client_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  currency?: InputMaybe<Order_By>;
  due_date?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  issued_date?: InputMaybe<Order_By>;
  notes?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  total_amount?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Billing_Invoice_Min_Fields = {
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
export type Billing_Invoice_Min_Order_By = {
  billing_period_end?: InputMaybe<Order_By>;
  billing_period_start?: InputMaybe<Order_By>;
  client_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  currency?: InputMaybe<Order_By>;
  due_date?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  issued_date?: InputMaybe<Order_By>;
  notes?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  total_amount?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "billing_invoice" */
export type Billing_Invoice_Mutation_Response = {
  __typename: "billing_invoice_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Billing_Invoice>;
};

/** input type for inserting object relation for remote table "billing_invoice" */
export type Billing_Invoice_Obj_Rel_Insert_Input = {
  data: Billing_Invoice_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Billing_Invoice_On_Conflict>;
};

/** on_conflict condition type for table "billing_invoice" */
export type Billing_Invoice_On_Conflict = {
  constraint: Billing_Invoice_Constraint;
  update_columns?: Array<Billing_Invoice_Update_Column>;
  where?: InputMaybe<Billing_Invoice_Bool_Exp>;
};

/** Ordering options when selecting data from "billing_invoice". */
export type Billing_Invoice_Order_By = {
  billing_event_logs_aggregate?: InputMaybe<Billing_Event_Log_Aggregate_Order_By>;
  billing_invoice_items_aggregate?: InputMaybe<Billing_Invoice_Item_Aggregate_Order_By>;
  billing_period_end?: InputMaybe<Order_By>;
  billing_period_start?: InputMaybe<Order_By>;
  client?: InputMaybe<Clients_Order_By>;
  client_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  currency?: InputMaybe<Order_By>;
  due_date?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  issued_date?: InputMaybe<Order_By>;
  notes?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  total_amount?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: billing_invoice */
export type Billing_Invoice_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "billing_invoice" */
export type Billing_Invoice_Select_Column =
  /** column name */
  | "billing_period_end"
  /** column name */
  | "billing_period_start"
  /** column name */
  | "client_id"
  /** column name */
  | "created_at"
  /** column name */
  | "currency"
  /** column name */
  | "due_date"
  /** column name */
  | "id"
  /** column name */
  | "issued_date"
  /** column name */
  | "notes"
  /** column name */
  | "status"
  /** column name */
  | "total_amount"
  /** column name */
  | "updated_at";

/** input type for updating data in table "billing_invoice" */
export type Billing_Invoice_Set_Input = {
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
export type Billing_Invoice_Stddev_Fields = {
  __typename: "billing_invoice_stddev_fields";
  total_amount: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "billing_invoice" */
export type Billing_Invoice_Stddev_Order_By = {
  total_amount?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Billing_Invoice_Stddev_Pop_Fields = {
  __typename: "billing_invoice_stddev_pop_fields";
  total_amount: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "billing_invoice" */
export type Billing_Invoice_Stddev_Pop_Order_By = {
  total_amount?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Billing_Invoice_Stddev_Samp_Fields = {
  __typename: "billing_invoice_stddev_samp_fields";
  total_amount: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "billing_invoice" */
export type Billing_Invoice_Stddev_Samp_Order_By = {
  total_amount?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "billing_invoice" */
export type Billing_Invoice_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Billing_Invoice_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Billing_Invoice_Stream_Cursor_Value_Input = {
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
export type Billing_Invoice_Sum_Fields = {
  __typename: "billing_invoice_sum_fields";
  total_amount: Maybe<Scalars["numeric"]["output"]>;
};

/** order by sum() on columns of table "billing_invoice" */
export type Billing_Invoice_Sum_Order_By = {
  total_amount?: InputMaybe<Order_By>;
};

/** update columns of table "billing_invoice" */
export type Billing_Invoice_Update_Column =
  /** column name */
  | "billing_period_end"
  /** column name */
  | "billing_period_start"
  /** column name */
  | "client_id"
  /** column name */
  | "created_at"
  /** column name */
  | "currency"
  /** column name */
  | "due_date"
  /** column name */
  | "id"
  /** column name */
  | "issued_date"
  /** column name */
  | "notes"
  /** column name */
  | "status"
  /** column name */
  | "total_amount"
  /** column name */
  | "updated_at";

export type Billing_Invoice_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Billing_Invoice_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Billing_Invoice_Set_Input>;
  /** filter the rows which have to be updated */
  where: Billing_Invoice_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Billing_Invoice_Var_Pop_Fields = {
  __typename: "billing_invoice_var_pop_fields";
  total_amount: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "billing_invoice" */
export type Billing_Invoice_Var_Pop_Order_By = {
  total_amount?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Billing_Invoice_Var_Samp_Fields = {
  __typename: "billing_invoice_var_samp_fields";
  total_amount: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "billing_invoice" */
export type Billing_Invoice_Var_Samp_Order_By = {
  total_amount?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Billing_Invoice_Variance_Fields = {
  __typename: "billing_invoice_variance_fields";
  total_amount: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "billing_invoice" */
export type Billing_Invoice_Variance_Order_By = {
  total_amount?: InputMaybe<Order_By>;
};

/** columns and relationships of "billing_invoices" */
export type Billing_Invoices = {
  __typename: "billing_invoices";
  /** An array relationship */
  billing_items: Array<Billing_Items>;
  /** An aggregate relationship */
  billing_items_aggregate: Billing_Items_Aggregate;
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
export type Billing_InvoicesBilling_ItemsArgs = {
  distinct_on?: InputMaybe<Array<Billing_Items_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Billing_Items_Order_By>>;
  where?: InputMaybe<Billing_Items_Bool_Exp>;
};

/** columns and relationships of "billing_invoices" */
export type Billing_InvoicesBilling_Items_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Billing_Items_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Billing_Items_Order_By>>;
  where?: InputMaybe<Billing_Items_Bool_Exp>;
};

/** aggregated selection of "billing_invoices" */
export type Billing_Invoices_Aggregate = {
  __typename: "billing_invoices_aggregate";
  aggregate: Maybe<Billing_Invoices_Aggregate_Fields>;
  nodes: Array<Billing_Invoices>;
};

export type Billing_Invoices_Aggregate_Bool_Exp = {
  count?: InputMaybe<Billing_Invoices_Aggregate_Bool_Exp_Count>;
};

export type Billing_Invoices_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Billing_Invoices_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Billing_Invoices_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "billing_invoices" */
export type Billing_Invoices_Aggregate_Fields = {
  __typename: "billing_invoices_aggregate_fields";
  avg: Maybe<Billing_Invoices_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max: Maybe<Billing_Invoices_Max_Fields>;
  min: Maybe<Billing_Invoices_Min_Fields>;
  stddev: Maybe<Billing_Invoices_Stddev_Fields>;
  stddev_pop: Maybe<Billing_Invoices_Stddev_Pop_Fields>;
  stddev_samp: Maybe<Billing_Invoices_Stddev_Samp_Fields>;
  sum: Maybe<Billing_Invoices_Sum_Fields>;
  var_pop: Maybe<Billing_Invoices_Var_Pop_Fields>;
  var_samp: Maybe<Billing_Invoices_Var_Samp_Fields>;
  variance: Maybe<Billing_Invoices_Variance_Fields>;
};

/** aggregate fields of "billing_invoices" */
export type Billing_Invoices_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Billing_Invoices_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "billing_invoices" */
export type Billing_Invoices_Aggregate_Order_By = {
  avg?: InputMaybe<Billing_Invoices_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Billing_Invoices_Max_Order_By>;
  min?: InputMaybe<Billing_Invoices_Min_Order_By>;
  stddev?: InputMaybe<Billing_Invoices_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Billing_Invoices_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Billing_Invoices_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Billing_Invoices_Sum_Order_By>;
  var_pop?: InputMaybe<Billing_Invoices_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Billing_Invoices_Var_Samp_Order_By>;
  variance?: InputMaybe<Billing_Invoices_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "billing_invoices" */
export type Billing_Invoices_Arr_Rel_Insert_Input = {
  data: Array<Billing_Invoices_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Billing_Invoices_On_Conflict>;
};

/** aggregate avg on columns */
export type Billing_Invoices_Avg_Fields = {
  __typename: "billing_invoices_avg_fields";
  total_amount: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "billing_invoices" */
export type Billing_Invoices_Avg_Order_By = {
  total_amount?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "billing_invoices". All fields are combined with a logical 'AND'. */
export type Billing_Invoices_Bool_Exp = {
  _and?: InputMaybe<Array<Billing_Invoices_Bool_Exp>>;
  _not?: InputMaybe<Billing_Invoices_Bool_Exp>;
  _or?: InputMaybe<Array<Billing_Invoices_Bool_Exp>>;
  billing_items?: InputMaybe<Billing_Items_Bool_Exp>;
  billing_items_aggregate?: InputMaybe<Billing_Items_Aggregate_Bool_Exp>;
  billing_period_end?: InputMaybe<Date_Comparison_Exp>;
  billing_period_start?: InputMaybe<Date_Comparison_Exp>;
  client?: InputMaybe<Clients_Bool_Exp>;
  client_id?: InputMaybe<Uuid_Comparison_Exp>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  invoice_number?: InputMaybe<String_Comparison_Exp>;
  status?: InputMaybe<String_Comparison_Exp>;
  total_amount?: InputMaybe<Numeric_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>;
};

/** unique or primary key constraints on table "billing_invoices" */
export type Billing_Invoices_Constraint =
  /** unique or primary key constraint on columns "invoice_number" */
  | "billing_invoices_invoice_number_key"
  /** unique or primary key constraint on columns "id" */
  | "billing_invoices_pkey";

/** input type for incrementing numeric columns in table "billing_invoices" */
export type Billing_Invoices_Inc_Input = {
  total_amount?: InputMaybe<Scalars["numeric"]["input"]>;
};

/** input type for inserting data into table "billing_invoices" */
export type Billing_Invoices_Insert_Input = {
  billing_items?: InputMaybe<Billing_Items_Arr_Rel_Insert_Input>;
  billing_period_end?: InputMaybe<Scalars["date"]["input"]>;
  billing_period_start?: InputMaybe<Scalars["date"]["input"]>;
  client?: InputMaybe<Clients_Obj_Rel_Insert_Input>;
  client_id?: InputMaybe<Scalars["uuid"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  invoice_number?: InputMaybe<Scalars["String"]["input"]>;
  status?: InputMaybe<Scalars["String"]["input"]>;
  total_amount?: InputMaybe<Scalars["numeric"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamp"]["input"]>;
};

/** aggregate max on columns */
export type Billing_Invoices_Max_Fields = {
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
export type Billing_Invoices_Max_Order_By = {
  billing_period_end?: InputMaybe<Order_By>;
  billing_period_start?: InputMaybe<Order_By>;
  client_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  invoice_number?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  total_amount?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Billing_Invoices_Min_Fields = {
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
export type Billing_Invoices_Min_Order_By = {
  billing_period_end?: InputMaybe<Order_By>;
  billing_period_start?: InputMaybe<Order_By>;
  client_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  invoice_number?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  total_amount?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "billing_invoices" */
export type Billing_Invoices_Mutation_Response = {
  __typename: "billing_invoices_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Billing_Invoices>;
};

/** input type for inserting object relation for remote table "billing_invoices" */
export type Billing_Invoices_Obj_Rel_Insert_Input = {
  data: Billing_Invoices_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Billing_Invoices_On_Conflict>;
};

/** on_conflict condition type for table "billing_invoices" */
export type Billing_Invoices_On_Conflict = {
  constraint: Billing_Invoices_Constraint;
  update_columns?: Array<Billing_Invoices_Update_Column>;
  where?: InputMaybe<Billing_Invoices_Bool_Exp>;
};

/** Ordering options when selecting data from "billing_invoices". */
export type Billing_Invoices_Order_By = {
  billing_items_aggregate?: InputMaybe<Billing_Items_Aggregate_Order_By>;
  billing_period_end?: InputMaybe<Order_By>;
  billing_period_start?: InputMaybe<Order_By>;
  client?: InputMaybe<Clients_Order_By>;
  client_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  invoice_number?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  total_amount?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: billing_invoices */
export type Billing_Invoices_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "billing_invoices" */
export type Billing_Invoices_Select_Column =
  /** column name */
  | "billing_period_end"
  /** column name */
  | "billing_period_start"
  /** column name */
  | "client_id"
  /** column name */
  | "created_at"
  /** column name */
  | "id"
  /** column name */
  | "invoice_number"
  /** column name */
  | "status"
  /** column name */
  | "total_amount"
  /** column name */
  | "updated_at";

/** input type for updating data in table "billing_invoices" */
export type Billing_Invoices_Set_Input = {
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
export type Billing_Invoices_Stddev_Fields = {
  __typename: "billing_invoices_stddev_fields";
  total_amount: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "billing_invoices" */
export type Billing_Invoices_Stddev_Order_By = {
  total_amount?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Billing_Invoices_Stddev_Pop_Fields = {
  __typename: "billing_invoices_stddev_pop_fields";
  total_amount: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "billing_invoices" */
export type Billing_Invoices_Stddev_Pop_Order_By = {
  total_amount?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Billing_Invoices_Stddev_Samp_Fields = {
  __typename: "billing_invoices_stddev_samp_fields";
  total_amount: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "billing_invoices" */
export type Billing_Invoices_Stddev_Samp_Order_By = {
  total_amount?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "billing_invoices" */
export type Billing_Invoices_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Billing_Invoices_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Billing_Invoices_Stream_Cursor_Value_Input = {
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
export type Billing_Invoices_Sum_Fields = {
  __typename: "billing_invoices_sum_fields";
  total_amount: Maybe<Scalars["numeric"]["output"]>;
};

/** order by sum() on columns of table "billing_invoices" */
export type Billing_Invoices_Sum_Order_By = {
  total_amount?: InputMaybe<Order_By>;
};

/** update columns of table "billing_invoices" */
export type Billing_Invoices_Update_Column =
  /** column name */
  | "billing_period_end"
  /** column name */
  | "billing_period_start"
  /** column name */
  | "client_id"
  /** column name */
  | "created_at"
  /** column name */
  | "id"
  /** column name */
  | "invoice_number"
  /** column name */
  | "status"
  /** column name */
  | "total_amount"
  /** column name */
  | "updated_at";

export type Billing_Invoices_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Billing_Invoices_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Billing_Invoices_Set_Input>;
  /** filter the rows which have to be updated */
  where: Billing_Invoices_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Billing_Invoices_Var_Pop_Fields = {
  __typename: "billing_invoices_var_pop_fields";
  total_amount: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "billing_invoices" */
export type Billing_Invoices_Var_Pop_Order_By = {
  total_amount?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Billing_Invoices_Var_Samp_Fields = {
  __typename: "billing_invoices_var_samp_fields";
  total_amount: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "billing_invoices" */
export type Billing_Invoices_Var_Samp_Order_By = {
  total_amount?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Billing_Invoices_Variance_Fields = {
  __typename: "billing_invoices_variance_fields";
  total_amount: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "billing_invoices" */
export type Billing_Invoices_Variance_Order_By = {
  total_amount?: InputMaybe<Order_By>;
};

/** columns and relationships of "billing_items" */
export type Billing_Items = {
  __typename: "billing_items";
  amount: Maybe<Scalars["numeric"]["output"]>;
  created_at: Maybe<Scalars["timestamp"]["output"]>;
  description: Maybe<Scalars["String"]["output"]>;
  id: Scalars["uuid"]["output"];
  invoice_id: Maybe<Scalars["uuid"]["output"]>;
  /** An object relationship */
  invoice_reference: Maybe<Billing_Invoices>;
  /** An object relationship */
  payroll: Maybe<Payrolls>;
  payroll_id: Maybe<Scalars["uuid"]["output"]>;
  quantity: Scalars["Int"]["output"];
  unit_price: Scalars["numeric"]["output"];
};

/** aggregated selection of "billing_items" */
export type Billing_Items_Aggregate = {
  __typename: "billing_items_aggregate";
  aggregate: Maybe<Billing_Items_Aggregate_Fields>;
  nodes: Array<Billing_Items>;
};

export type Billing_Items_Aggregate_Bool_Exp = {
  count?: InputMaybe<Billing_Items_Aggregate_Bool_Exp_Count>;
};

export type Billing_Items_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Billing_Items_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Billing_Items_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "billing_items" */
export type Billing_Items_Aggregate_Fields = {
  __typename: "billing_items_aggregate_fields";
  avg: Maybe<Billing_Items_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max: Maybe<Billing_Items_Max_Fields>;
  min: Maybe<Billing_Items_Min_Fields>;
  stddev: Maybe<Billing_Items_Stddev_Fields>;
  stddev_pop: Maybe<Billing_Items_Stddev_Pop_Fields>;
  stddev_samp: Maybe<Billing_Items_Stddev_Samp_Fields>;
  sum: Maybe<Billing_Items_Sum_Fields>;
  var_pop: Maybe<Billing_Items_Var_Pop_Fields>;
  var_samp: Maybe<Billing_Items_Var_Samp_Fields>;
  variance: Maybe<Billing_Items_Variance_Fields>;
};

/** aggregate fields of "billing_items" */
export type Billing_Items_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Billing_Items_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "billing_items" */
export type Billing_Items_Aggregate_Order_By = {
  avg?: InputMaybe<Billing_Items_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Billing_Items_Max_Order_By>;
  min?: InputMaybe<Billing_Items_Min_Order_By>;
  stddev?: InputMaybe<Billing_Items_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Billing_Items_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Billing_Items_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Billing_Items_Sum_Order_By>;
  var_pop?: InputMaybe<Billing_Items_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Billing_Items_Var_Samp_Order_By>;
  variance?: InputMaybe<Billing_Items_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "billing_items" */
export type Billing_Items_Arr_Rel_Insert_Input = {
  data: Array<Billing_Items_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Billing_Items_On_Conflict>;
};

/** aggregate avg on columns */
export type Billing_Items_Avg_Fields = {
  __typename: "billing_items_avg_fields";
  amount: Maybe<Scalars["Float"]["output"]>;
  quantity: Maybe<Scalars["Float"]["output"]>;
  unit_price: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "billing_items" */
export type Billing_Items_Avg_Order_By = {
  amount?: InputMaybe<Order_By>;
  quantity?: InputMaybe<Order_By>;
  unit_price?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "billing_items". All fields are combined with a logical 'AND'. */
export type Billing_Items_Bool_Exp = {
  _and?: InputMaybe<Array<Billing_Items_Bool_Exp>>;
  _not?: InputMaybe<Billing_Items_Bool_Exp>;
  _or?: InputMaybe<Array<Billing_Items_Bool_Exp>>;
  amount?: InputMaybe<Numeric_Comparison_Exp>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  invoice_id?: InputMaybe<Uuid_Comparison_Exp>;
  invoice_reference?: InputMaybe<Billing_Invoices_Bool_Exp>;
  payroll?: InputMaybe<Payrolls_Bool_Exp>;
  payroll_id?: InputMaybe<Uuid_Comparison_Exp>;
  quantity?: InputMaybe<Int_Comparison_Exp>;
  unit_price?: InputMaybe<Numeric_Comparison_Exp>;
};

/** unique or primary key constraints on table "billing_items" */
export type Billing_Items_Constraint =
  /** unique or primary key constraint on columns "id" */
  "billing_items_pkey";

/** input type for incrementing numeric columns in table "billing_items" */
export type Billing_Items_Inc_Input = {
  quantity?: InputMaybe<Scalars["Int"]["input"]>;
  unit_price?: InputMaybe<Scalars["numeric"]["input"]>;
};

/** input type for inserting data into table "billing_items" */
export type Billing_Items_Insert_Input = {
  created_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  invoice_id?: InputMaybe<Scalars["uuid"]["input"]>;
  invoice_reference?: InputMaybe<Billing_Invoices_Obj_Rel_Insert_Input>;
  payroll?: InputMaybe<Payrolls_Obj_Rel_Insert_Input>;
  payroll_id?: InputMaybe<Scalars["uuid"]["input"]>;
  quantity?: InputMaybe<Scalars["Int"]["input"]>;
  unit_price?: InputMaybe<Scalars["numeric"]["input"]>;
};

/** aggregate max on columns */
export type Billing_Items_Max_Fields = {
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
export type Billing_Items_Max_Order_By = {
  amount?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  invoice_id?: InputMaybe<Order_By>;
  payroll_id?: InputMaybe<Order_By>;
  quantity?: InputMaybe<Order_By>;
  unit_price?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Billing_Items_Min_Fields = {
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
export type Billing_Items_Min_Order_By = {
  amount?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  invoice_id?: InputMaybe<Order_By>;
  payroll_id?: InputMaybe<Order_By>;
  quantity?: InputMaybe<Order_By>;
  unit_price?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "billing_items" */
export type Billing_Items_Mutation_Response = {
  __typename: "billing_items_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Billing_Items>;
};

/** on_conflict condition type for table "billing_items" */
export type Billing_Items_On_Conflict = {
  constraint: Billing_Items_Constraint;
  update_columns?: Array<Billing_Items_Update_Column>;
  where?: InputMaybe<Billing_Items_Bool_Exp>;
};

/** Ordering options when selecting data from "billing_items". */
export type Billing_Items_Order_By = {
  amount?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  invoice_id?: InputMaybe<Order_By>;
  invoice_reference?: InputMaybe<Billing_Invoices_Order_By>;
  payroll?: InputMaybe<Payrolls_Order_By>;
  payroll_id?: InputMaybe<Order_By>;
  quantity?: InputMaybe<Order_By>;
  unit_price?: InputMaybe<Order_By>;
};

/** primary key columns input for table: billing_items */
export type Billing_Items_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "billing_items" */
export type Billing_Items_Select_Column =
  /** column name */
  | "amount"
  /** column name */
  | "created_at"
  /** column name */
  | "description"
  /** column name */
  | "id"
  /** column name */
  | "invoice_id"
  /** column name */
  | "payroll_id"
  /** column name */
  | "quantity"
  /** column name */
  | "unit_price";

/** input type for updating data in table "billing_items" */
export type Billing_Items_Set_Input = {
  created_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  invoice_id?: InputMaybe<Scalars["uuid"]["input"]>;
  payroll_id?: InputMaybe<Scalars["uuid"]["input"]>;
  quantity?: InputMaybe<Scalars["Int"]["input"]>;
  unit_price?: InputMaybe<Scalars["numeric"]["input"]>;
};

/** aggregate stddev on columns */
export type Billing_Items_Stddev_Fields = {
  __typename: "billing_items_stddev_fields";
  amount: Maybe<Scalars["Float"]["output"]>;
  quantity: Maybe<Scalars["Float"]["output"]>;
  unit_price: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "billing_items" */
export type Billing_Items_Stddev_Order_By = {
  amount?: InputMaybe<Order_By>;
  quantity?: InputMaybe<Order_By>;
  unit_price?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Billing_Items_Stddev_Pop_Fields = {
  __typename: "billing_items_stddev_pop_fields";
  amount: Maybe<Scalars["Float"]["output"]>;
  quantity: Maybe<Scalars["Float"]["output"]>;
  unit_price: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "billing_items" */
export type Billing_Items_Stddev_Pop_Order_By = {
  amount?: InputMaybe<Order_By>;
  quantity?: InputMaybe<Order_By>;
  unit_price?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Billing_Items_Stddev_Samp_Fields = {
  __typename: "billing_items_stddev_samp_fields";
  amount: Maybe<Scalars["Float"]["output"]>;
  quantity: Maybe<Scalars["Float"]["output"]>;
  unit_price: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "billing_items" */
export type Billing_Items_Stddev_Samp_Order_By = {
  amount?: InputMaybe<Order_By>;
  quantity?: InputMaybe<Order_By>;
  unit_price?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "billing_items" */
export type Billing_Items_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Billing_Items_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Billing_Items_Stream_Cursor_Value_Input = {
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
export type Billing_Items_Sum_Fields = {
  __typename: "billing_items_sum_fields";
  amount: Maybe<Scalars["numeric"]["output"]>;
  quantity: Maybe<Scalars["Int"]["output"]>;
  unit_price: Maybe<Scalars["numeric"]["output"]>;
};

/** order by sum() on columns of table "billing_items" */
export type Billing_Items_Sum_Order_By = {
  amount?: InputMaybe<Order_By>;
  quantity?: InputMaybe<Order_By>;
  unit_price?: InputMaybe<Order_By>;
};

/** update columns of table "billing_items" */
export type Billing_Items_Update_Column =
  /** column name */
  | "created_at"
  /** column name */
  | "description"
  /** column name */
  | "id"
  /** column name */
  | "invoice_id"
  /** column name */
  | "payroll_id"
  /** column name */
  | "quantity"
  /** column name */
  | "unit_price";

export type Billing_Items_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Billing_Items_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Billing_Items_Set_Input>;
  /** filter the rows which have to be updated */
  where: Billing_Items_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Billing_Items_Var_Pop_Fields = {
  __typename: "billing_items_var_pop_fields";
  amount: Maybe<Scalars["Float"]["output"]>;
  quantity: Maybe<Scalars["Float"]["output"]>;
  unit_price: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "billing_items" */
export type Billing_Items_Var_Pop_Order_By = {
  amount?: InputMaybe<Order_By>;
  quantity?: InputMaybe<Order_By>;
  unit_price?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Billing_Items_Var_Samp_Fields = {
  __typename: "billing_items_var_samp_fields";
  amount: Maybe<Scalars["Float"]["output"]>;
  quantity: Maybe<Scalars["Float"]["output"]>;
  unit_price: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "billing_items" */
export type Billing_Items_Var_Samp_Order_By = {
  amount?: InputMaybe<Order_By>;
  quantity?: InputMaybe<Order_By>;
  unit_price?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Billing_Items_Variance_Fields = {
  __typename: "billing_items_variance_fields";
  amount: Maybe<Scalars["Float"]["output"]>;
  quantity: Maybe<Scalars["Float"]["output"]>;
  unit_price: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "billing_items" */
export type Billing_Items_Variance_Order_By = {
  amount?: InputMaybe<Order_By>;
  quantity?: InputMaybe<Order_By>;
  unit_price?: InputMaybe<Order_By>;
};

/** columns and relationships of "billing_plan" */
export type Billing_Plan = {
  __typename: "billing_plan";
  /** An array relationship */
  client_billing_assignments: Array<Client_Billing_Assignment>;
  /** An aggregate relationship */
  client_billing_assignments_aggregate: Client_Billing_Assignment_Aggregate;
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  currency: Scalars["String"]["output"];
  description: Maybe<Scalars["String"]["output"]>;
  id: Scalars["uuid"]["output"];
  name: Scalars["String"]["output"];
  rate_per_payroll: Scalars["numeric"]["output"];
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
};

/** columns and relationships of "billing_plan" */
export type Billing_PlanClient_Billing_AssignmentsArgs = {
  distinct_on?: InputMaybe<Array<Client_Billing_Assignment_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Client_Billing_Assignment_Order_By>>;
  where?: InputMaybe<Client_Billing_Assignment_Bool_Exp>;
};

/** columns and relationships of "billing_plan" */
export type Billing_PlanClient_Billing_Assignments_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Client_Billing_Assignment_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Client_Billing_Assignment_Order_By>>;
  where?: InputMaybe<Client_Billing_Assignment_Bool_Exp>;
};

/** aggregated selection of "billing_plan" */
export type Billing_Plan_Aggregate = {
  __typename: "billing_plan_aggregate";
  aggregate: Maybe<Billing_Plan_Aggregate_Fields>;
  nodes: Array<Billing_Plan>;
};

/** aggregate fields of "billing_plan" */
export type Billing_Plan_Aggregate_Fields = {
  __typename: "billing_plan_aggregate_fields";
  avg: Maybe<Billing_Plan_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max: Maybe<Billing_Plan_Max_Fields>;
  min: Maybe<Billing_Plan_Min_Fields>;
  stddev: Maybe<Billing_Plan_Stddev_Fields>;
  stddev_pop: Maybe<Billing_Plan_Stddev_Pop_Fields>;
  stddev_samp: Maybe<Billing_Plan_Stddev_Samp_Fields>;
  sum: Maybe<Billing_Plan_Sum_Fields>;
  var_pop: Maybe<Billing_Plan_Var_Pop_Fields>;
  var_samp: Maybe<Billing_Plan_Var_Samp_Fields>;
  variance: Maybe<Billing_Plan_Variance_Fields>;
};

/** aggregate fields of "billing_plan" */
export type Billing_Plan_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Billing_Plan_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** aggregate avg on columns */
export type Billing_Plan_Avg_Fields = {
  __typename: "billing_plan_avg_fields";
  rate_per_payroll: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to filter rows from the table "billing_plan". All fields are combined with a logical 'AND'. */
export type Billing_Plan_Bool_Exp = {
  _and?: InputMaybe<Array<Billing_Plan_Bool_Exp>>;
  _not?: InputMaybe<Billing_Plan_Bool_Exp>;
  _or?: InputMaybe<Array<Billing_Plan_Bool_Exp>>;
  client_billing_assignments?: InputMaybe<Client_Billing_Assignment_Bool_Exp>;
  client_billing_assignments_aggregate?: InputMaybe<Client_Billing_Assignment_Aggregate_Bool_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  currency?: InputMaybe<String_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  rate_per_payroll?: InputMaybe<Numeric_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "billing_plan" */
export type Billing_Plan_Constraint =
  /** unique or primary key constraint on columns "id" */
  "billing_plan_pkey";

/** input type for incrementing numeric columns in table "billing_plan" */
export type Billing_Plan_Inc_Input = {
  rate_per_payroll?: InputMaybe<Scalars["numeric"]["input"]>;
};

/** input type for inserting data into table "billing_plan" */
export type Billing_Plan_Insert_Input = {
  client_billing_assignments?: InputMaybe<Client_Billing_Assignment_Arr_Rel_Insert_Input>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  currency?: InputMaybe<Scalars["String"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  rate_per_payroll?: InputMaybe<Scalars["numeric"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** aggregate max on columns */
export type Billing_Plan_Max_Fields = {
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
export type Billing_Plan_Min_Fields = {
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
export type Billing_Plan_Mutation_Response = {
  __typename: "billing_plan_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Billing_Plan>;
};

/** input type for inserting object relation for remote table "billing_plan" */
export type Billing_Plan_Obj_Rel_Insert_Input = {
  data: Billing_Plan_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Billing_Plan_On_Conflict>;
};

/** on_conflict condition type for table "billing_plan" */
export type Billing_Plan_On_Conflict = {
  constraint: Billing_Plan_Constraint;
  update_columns?: Array<Billing_Plan_Update_Column>;
  where?: InputMaybe<Billing_Plan_Bool_Exp>;
};

/** Ordering options when selecting data from "billing_plan". */
export type Billing_Plan_Order_By = {
  client_billing_assignments_aggregate?: InputMaybe<Client_Billing_Assignment_Aggregate_Order_By>;
  created_at?: InputMaybe<Order_By>;
  currency?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  rate_per_payroll?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: billing_plan */
export type Billing_Plan_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "billing_plan" */
export type Billing_Plan_Select_Column =
  /** column name */
  | "created_at"
  /** column name */
  | "currency"
  /** column name */
  | "description"
  /** column name */
  | "id"
  /** column name */
  | "name"
  /** column name */
  | "rate_per_payroll"
  /** column name */
  | "updated_at";

/** input type for updating data in table "billing_plan" */
export type Billing_Plan_Set_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  currency?: InputMaybe<Scalars["String"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  rate_per_payroll?: InputMaybe<Scalars["numeric"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** aggregate stddev on columns */
export type Billing_Plan_Stddev_Fields = {
  __typename: "billing_plan_stddev_fields";
  rate_per_payroll: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type Billing_Plan_Stddev_Pop_Fields = {
  __typename: "billing_plan_stddev_pop_fields";
  rate_per_payroll: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type Billing_Plan_Stddev_Samp_Fields = {
  __typename: "billing_plan_stddev_samp_fields";
  rate_per_payroll: Maybe<Scalars["Float"]["output"]>;
};

/** Streaming cursor of the table "billing_plan" */
export type Billing_Plan_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Billing_Plan_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Billing_Plan_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  currency?: InputMaybe<Scalars["String"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  rate_per_payroll?: InputMaybe<Scalars["numeric"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** aggregate sum on columns */
export type Billing_Plan_Sum_Fields = {
  __typename: "billing_plan_sum_fields";
  rate_per_payroll: Maybe<Scalars["numeric"]["output"]>;
};

/** update columns of table "billing_plan" */
export type Billing_Plan_Update_Column =
  /** column name */
  | "created_at"
  /** column name */
  | "currency"
  /** column name */
  | "description"
  /** column name */
  | "id"
  /** column name */
  | "name"
  /** column name */
  | "rate_per_payroll"
  /** column name */
  | "updated_at";

export type Billing_Plan_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Billing_Plan_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Billing_Plan_Set_Input>;
  /** filter the rows which have to be updated */
  where: Billing_Plan_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Billing_Plan_Var_Pop_Fields = {
  __typename: "billing_plan_var_pop_fields";
  rate_per_payroll: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate var_samp on columns */
export type Billing_Plan_Var_Samp_Fields = {
  __typename: "billing_plan_var_samp_fields";
  rate_per_payroll: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate variance on columns */
export type Billing_Plan_Variance_Fields = {
  __typename: "billing_plan_variance_fields";
  rate_per_payroll: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to compare columns of type "bpchar". All fields are combined with logical 'AND'. */
export type Bpchar_Comparison_Exp = {
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
export type Client_Billing_Assignment = {
  __typename: "client_billing_assignment";
  /** An object relationship */
  billing_plan: Billing_Plan;
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
export type Client_Billing_Assignment_Aggregate = {
  __typename: "client_billing_assignment_aggregate";
  aggregate: Maybe<Client_Billing_Assignment_Aggregate_Fields>;
  nodes: Array<Client_Billing_Assignment>;
};

export type Client_Billing_Assignment_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Client_Billing_Assignment_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Client_Billing_Assignment_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Client_Billing_Assignment_Aggregate_Bool_Exp_Count>;
};

export type Client_Billing_Assignment_Aggregate_Bool_Exp_Bool_And = {
  arguments: Client_Billing_Assignment_Select_Column_Client_Billing_Assignment_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Client_Billing_Assignment_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Client_Billing_Assignment_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Client_Billing_Assignment_Select_Column_Client_Billing_Assignment_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Client_Billing_Assignment_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Client_Billing_Assignment_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Client_Billing_Assignment_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Client_Billing_Assignment_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "client_billing_assignment" */
export type Client_Billing_Assignment_Aggregate_Fields = {
  __typename: "client_billing_assignment_aggregate_fields";
  count: Scalars["Int"]["output"];
  max: Maybe<Client_Billing_Assignment_Max_Fields>;
  min: Maybe<Client_Billing_Assignment_Min_Fields>;
};

/** aggregate fields of "client_billing_assignment" */
export type Client_Billing_Assignment_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Client_Billing_Assignment_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "client_billing_assignment" */
export type Client_Billing_Assignment_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Client_Billing_Assignment_Max_Order_By>;
  min?: InputMaybe<Client_Billing_Assignment_Min_Order_By>;
};

/** input type for inserting array relation for remote table "client_billing_assignment" */
export type Client_Billing_Assignment_Arr_Rel_Insert_Input = {
  data: Array<Client_Billing_Assignment_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Client_Billing_Assignment_On_Conflict>;
};

/** Boolean expression to filter rows from the table "client_billing_assignment". All fields are combined with a logical 'AND'. */
export type Client_Billing_Assignment_Bool_Exp = {
  _and?: InputMaybe<Array<Client_Billing_Assignment_Bool_Exp>>;
  _not?: InputMaybe<Client_Billing_Assignment_Bool_Exp>;
  _or?: InputMaybe<Array<Client_Billing_Assignment_Bool_Exp>>;
  billing_plan?: InputMaybe<Billing_Plan_Bool_Exp>;
  billing_plan_id?: InputMaybe<Uuid_Comparison_Exp>;
  client?: InputMaybe<Clients_Bool_Exp>;
  client_id?: InputMaybe<Uuid_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  end_date?: InputMaybe<Date_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  is_active?: InputMaybe<Boolean_Comparison_Exp>;
  start_date?: InputMaybe<Date_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "client_billing_assignment" */
export type Client_Billing_Assignment_Constraint =
  /** unique or primary key constraint on columns "id" */
  "client_billing_assignment_pkey";

/** input type for inserting data into table "client_billing_assignment" */
export type Client_Billing_Assignment_Insert_Input = {
  billing_plan?: InputMaybe<Billing_Plan_Obj_Rel_Insert_Input>;
  billing_plan_id?: InputMaybe<Scalars["uuid"]["input"]>;
  client?: InputMaybe<Clients_Obj_Rel_Insert_Input>;
  client_id?: InputMaybe<Scalars["uuid"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  end_date?: InputMaybe<Scalars["date"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  is_active?: InputMaybe<Scalars["Boolean"]["input"]>;
  start_date?: InputMaybe<Scalars["date"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** aggregate max on columns */
export type Client_Billing_Assignment_Max_Fields = {
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
export type Client_Billing_Assignment_Max_Order_By = {
  billing_plan_id?: InputMaybe<Order_By>;
  client_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  end_date?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  start_date?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Client_Billing_Assignment_Min_Fields = {
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
export type Client_Billing_Assignment_Min_Order_By = {
  billing_plan_id?: InputMaybe<Order_By>;
  client_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  end_date?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  start_date?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "client_billing_assignment" */
export type Client_Billing_Assignment_Mutation_Response = {
  __typename: "client_billing_assignment_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Client_Billing_Assignment>;
};

/** on_conflict condition type for table "client_billing_assignment" */
export type Client_Billing_Assignment_On_Conflict = {
  constraint: Client_Billing_Assignment_Constraint;
  update_columns?: Array<Client_Billing_Assignment_Update_Column>;
  where?: InputMaybe<Client_Billing_Assignment_Bool_Exp>;
};

/** Ordering options when selecting data from "client_billing_assignment". */
export type Client_Billing_Assignment_Order_By = {
  billing_plan?: InputMaybe<Billing_Plan_Order_By>;
  billing_plan_id?: InputMaybe<Order_By>;
  client?: InputMaybe<Clients_Order_By>;
  client_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  end_date?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_active?: InputMaybe<Order_By>;
  start_date?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: client_billing_assignment */
export type Client_Billing_Assignment_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "client_billing_assignment" */
export type Client_Billing_Assignment_Select_Column =
  /** column name */
  | "billing_plan_id"
  /** column name */
  | "client_id"
  /** column name */
  | "created_at"
  /** column name */
  | "end_date"
  /** column name */
  | "id"
  /** column name */
  | "is_active"
  /** column name */
  | "start_date"
  /** column name */
  | "updated_at";

/** select "client_billing_assignment_aggregate_bool_exp_bool_and_arguments_columns" columns of table "client_billing_assignment" */
export type Client_Billing_Assignment_Select_Column_Client_Billing_Assignment_Aggregate_Bool_Exp_Bool_And_Arguments_Columns =
  /** column name */
  "is_active";

/** select "client_billing_assignment_aggregate_bool_exp_bool_or_arguments_columns" columns of table "client_billing_assignment" */
export type Client_Billing_Assignment_Select_Column_Client_Billing_Assignment_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns =
  /** column name */
  "is_active";

/** input type for updating data in table "client_billing_assignment" */
export type Client_Billing_Assignment_Set_Input = {
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
export type Client_Billing_Assignment_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Client_Billing_Assignment_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Client_Billing_Assignment_Stream_Cursor_Value_Input = {
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
export type Client_Billing_Assignment_Update_Column =
  /** column name */
  | "billing_plan_id"
  /** column name */
  | "client_id"
  /** column name */
  | "created_at"
  /** column name */
  | "end_date"
  /** column name */
  | "id"
  /** column name */
  | "is_active"
  /** column name */
  | "start_date"
  /** column name */
  | "updated_at";

export type Client_Billing_Assignment_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Client_Billing_Assignment_Set_Input>;
  /** filter the rows which have to be updated */
  where: Client_Billing_Assignment_Bool_Exp;
};

/** columns and relationships of "client_external_systems" */
export type Client_External_Systems = {
  __typename: "client_external_systems";
  /** An object relationship */
  client: Clients;
  /** Reference to the client */
  client_id: Scalars["uuid"]["output"];
  /** Timestamp when the mapping was created */
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  /** An object relationship */
  external_system: External_Systems;
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
export type Client_External_Systems_Aggregate = {
  __typename: "client_external_systems_aggregate";
  aggregate: Maybe<Client_External_Systems_Aggregate_Fields>;
  nodes: Array<Client_External_Systems>;
};

export type Client_External_Systems_Aggregate_Bool_Exp = {
  count?: InputMaybe<Client_External_Systems_Aggregate_Bool_Exp_Count>;
};

export type Client_External_Systems_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Client_External_Systems_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Client_External_Systems_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "client_external_systems" */
export type Client_External_Systems_Aggregate_Fields = {
  __typename: "client_external_systems_aggregate_fields";
  count: Scalars["Int"]["output"];
  max: Maybe<Client_External_Systems_Max_Fields>;
  min: Maybe<Client_External_Systems_Min_Fields>;
};

/** aggregate fields of "client_external_systems" */
export type Client_External_Systems_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Client_External_Systems_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "client_external_systems" */
export type Client_External_Systems_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Client_External_Systems_Max_Order_By>;
  min?: InputMaybe<Client_External_Systems_Min_Order_By>;
};

/** input type for inserting array relation for remote table "client_external_systems" */
export type Client_External_Systems_Arr_Rel_Insert_Input = {
  data: Array<Client_External_Systems_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Client_External_Systems_On_Conflict>;
};

/** Boolean expression to filter rows from the table "client_external_systems". All fields are combined with a logical 'AND'. */
export type Client_External_Systems_Bool_Exp = {
  _and?: InputMaybe<Array<Client_External_Systems_Bool_Exp>>;
  _not?: InputMaybe<Client_External_Systems_Bool_Exp>;
  _or?: InputMaybe<Array<Client_External_Systems_Bool_Exp>>;
  client?: InputMaybe<Clients_Bool_Exp>;
  client_id?: InputMaybe<Uuid_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  external_system?: InputMaybe<External_Systems_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  system_client_id?: InputMaybe<String_Comparison_Exp>;
  system_id?: InputMaybe<Uuid_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "client_external_systems" */
export type Client_External_Systems_Constraint =
  /** unique or primary key constraint on columns "client_id", "system_id" */
  | "client_external_systems_client_id_system_id_key"
  /** unique or primary key constraint on columns "id" */
  | "client_external_systems_pkey";

/** input type for inserting data into table "client_external_systems" */
export type Client_External_Systems_Insert_Input = {
  client?: InputMaybe<Clients_Obj_Rel_Insert_Input>;
  /** Reference to the client */
  client_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Timestamp when the mapping was created */
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  external_system?: InputMaybe<External_Systems_Obj_Rel_Insert_Input>;
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
export type Client_External_Systems_Max_Fields = {
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
export type Client_External_Systems_Max_Order_By = {
  /** Reference to the client */
  client_id?: InputMaybe<Order_By>;
  /** Timestamp when the mapping was created */
  created_at?: InputMaybe<Order_By>;
  /** Unique identifier for the client-system mapping */
  id?: InputMaybe<Order_By>;
  /** Client identifier in the external system */
  system_client_id?: InputMaybe<Order_By>;
  /** Reference to the external system */
  system_id?: InputMaybe<Order_By>;
  /** Timestamp when the mapping was last updated */
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Client_External_Systems_Min_Fields = {
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
export type Client_External_Systems_Min_Order_By = {
  /** Reference to the client */
  client_id?: InputMaybe<Order_By>;
  /** Timestamp when the mapping was created */
  created_at?: InputMaybe<Order_By>;
  /** Unique identifier for the client-system mapping */
  id?: InputMaybe<Order_By>;
  /** Client identifier in the external system */
  system_client_id?: InputMaybe<Order_By>;
  /** Reference to the external system */
  system_id?: InputMaybe<Order_By>;
  /** Timestamp when the mapping was last updated */
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "client_external_systems" */
export type Client_External_Systems_Mutation_Response = {
  __typename: "client_external_systems_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Client_External_Systems>;
};

/** on_conflict condition type for table "client_external_systems" */
export type Client_External_Systems_On_Conflict = {
  constraint: Client_External_Systems_Constraint;
  update_columns?: Array<Client_External_Systems_Update_Column>;
  where?: InputMaybe<Client_External_Systems_Bool_Exp>;
};

/** Ordering options when selecting data from "client_external_systems". */
export type Client_External_Systems_Order_By = {
  client?: InputMaybe<Clients_Order_By>;
  client_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  external_system?: InputMaybe<External_Systems_Order_By>;
  id?: InputMaybe<Order_By>;
  system_client_id?: InputMaybe<Order_By>;
  system_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: client_external_systems */
export type Client_External_Systems_Pk_Columns_Input = {
  /** Unique identifier for the client-system mapping */
  id: Scalars["uuid"]["input"];
};

/** select columns of table "client_external_systems" */
export type Client_External_Systems_Select_Column =
  /** column name */
  | "client_id"
  /** column name */
  | "created_at"
  /** column name */
  | "id"
  /** column name */
  | "system_client_id"
  /** column name */
  | "system_id"
  /** column name */
  | "updated_at";

/** input type for updating data in table "client_external_systems" */
export type Client_External_Systems_Set_Input = {
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
export type Client_External_Systems_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Client_External_Systems_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Client_External_Systems_Stream_Cursor_Value_Input = {
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
export type Client_External_Systems_Update_Column =
  /** column name */
  | "client_id"
  /** column name */
  | "created_at"
  /** column name */
  | "id"
  /** column name */
  | "system_client_id"
  /** column name */
  | "system_id"
  /** column name */
  | "updated_at";

export type Client_External_Systems_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Client_External_Systems_Set_Input>;
  /** filter the rows which have to be updated */
  where: Client_External_Systems_Bool_Exp;
};

/** columns and relationships of "clients" */
export type Clients = {
  __typename: "clients";
  /** Whether the client is currently active */
  active: Maybe<Scalars["Boolean"]["output"]>;
  /** An array relationship */
  billing_invoices: Array<Billing_Invoice>;
  /** An aggregate relationship */
  billing_invoices_aggregate: Billing_Invoice_Aggregate;
  /** An array relationship */
  client_billing_assignments: Array<Client_Billing_Assignment>;
  /** An aggregate relationship */
  client_billing_assignments_aggregate: Client_Billing_Assignment_Aggregate;
  /** An array relationship */
  client_billing_invoices: Array<Billing_Invoices>;
  /** An aggregate relationship */
  client_billing_invoices_aggregate: Billing_Invoices_Aggregate;
  /** An array relationship */
  client_external_systems: Array<Client_External_Systems>;
  /** An aggregate relationship */
  client_external_systems_aggregate: Client_External_Systems_Aggregate;
  /** Email address for the client contact */
  contact_email: Maybe<Scalars["String"]["output"]>;
  /** Primary contact person at the client */
  contact_person: Maybe<Scalars["String"]["output"]>;
  /** Phone number for the client contact */
  contact_phone: Maybe<Scalars["String"]["output"]>;
  /** Timestamp when the client was created */
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  /** Unique identifier for the client */
  id: Scalars["uuid"]["output"];
  /** Client company name */
  name: Scalars["String"]["output"];
  /** An array relationship */
  payrolls: Array<Payrolls>;
  /** An aggregate relationship */
  payrolls_aggregate: Payrolls_Aggregate;
  /** Timestamp when the client was last updated */
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
};

/** columns and relationships of "clients" */
export type ClientsBilling_InvoicesArgs = {
  distinct_on?: InputMaybe<Array<Billing_Invoice_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Billing_Invoice_Order_By>>;
  where?: InputMaybe<Billing_Invoice_Bool_Exp>;
};

/** columns and relationships of "clients" */
export type ClientsBilling_Invoices_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Billing_Invoice_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Billing_Invoice_Order_By>>;
  where?: InputMaybe<Billing_Invoice_Bool_Exp>;
};

/** columns and relationships of "clients" */
export type ClientsClient_Billing_AssignmentsArgs = {
  distinct_on?: InputMaybe<Array<Client_Billing_Assignment_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Client_Billing_Assignment_Order_By>>;
  where?: InputMaybe<Client_Billing_Assignment_Bool_Exp>;
};

/** columns and relationships of "clients" */
export type ClientsClient_Billing_Assignments_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Client_Billing_Assignment_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Client_Billing_Assignment_Order_By>>;
  where?: InputMaybe<Client_Billing_Assignment_Bool_Exp>;
};

/** columns and relationships of "clients" */
export type ClientsClient_Billing_InvoicesArgs = {
  distinct_on?: InputMaybe<Array<Billing_Invoices_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Billing_Invoices_Order_By>>;
  where?: InputMaybe<Billing_Invoices_Bool_Exp>;
};

/** columns and relationships of "clients" */
export type ClientsClient_Billing_Invoices_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Billing_Invoices_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Billing_Invoices_Order_By>>;
  where?: InputMaybe<Billing_Invoices_Bool_Exp>;
};

/** columns and relationships of "clients" */
export type ClientsClient_External_SystemsArgs = {
  distinct_on?: InputMaybe<Array<Client_External_Systems_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Client_External_Systems_Order_By>>;
  where?: InputMaybe<Client_External_Systems_Bool_Exp>;
};

/** columns and relationships of "clients" */
export type ClientsClient_External_Systems_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Client_External_Systems_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Client_External_Systems_Order_By>>;
  where?: InputMaybe<Client_External_Systems_Bool_Exp>;
};

/** columns and relationships of "clients" */
export type ClientsPayrollsArgs = {
  distinct_on?: InputMaybe<Array<Payrolls_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payrolls_Order_By>>;
  where?: InputMaybe<Payrolls_Bool_Exp>;
};

/** columns and relationships of "clients" */
export type ClientsPayrolls_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payrolls_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payrolls_Order_By>>;
  where?: InputMaybe<Payrolls_Bool_Exp>;
};

/** aggregated selection of "clients" */
export type Clients_Aggregate = {
  __typename: "clients_aggregate";
  aggregate: Maybe<Clients_Aggregate_Fields>;
  nodes: Array<Clients>;
};

export type Clients_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Clients_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Clients_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Clients_Aggregate_Bool_Exp_Count>;
};

export type Clients_Aggregate_Bool_Exp_Bool_And = {
  arguments: Clients_Select_Column_Clients_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Clients_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Clients_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Clients_Select_Column_Clients_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Clients_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Clients_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Clients_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Clients_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "clients" */
export type Clients_Aggregate_Fields = {
  __typename: "clients_aggregate_fields";
  count: Scalars["Int"]["output"];
  max: Maybe<Clients_Max_Fields>;
  min: Maybe<Clients_Min_Fields>;
};

/** aggregate fields of "clients" */
export type Clients_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Clients_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "clients" */
export type Clients_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Clients_Max_Order_By>;
  min?: InputMaybe<Clients_Min_Order_By>;
};

/** input type for inserting array relation for remote table "clients" */
export type Clients_Arr_Rel_Insert_Input = {
  data: Array<Clients_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Clients_On_Conflict>;
};

/** Boolean expression to filter rows from the table "clients". All fields are combined with a logical 'AND'. */
export type Clients_Bool_Exp = {
  _and?: InputMaybe<Array<Clients_Bool_Exp>>;
  _not?: InputMaybe<Clients_Bool_Exp>;
  _or?: InputMaybe<Array<Clients_Bool_Exp>>;
  active?: InputMaybe<Boolean_Comparison_Exp>;
  billing_invoices?: InputMaybe<Billing_Invoice_Bool_Exp>;
  billing_invoices_aggregate?: InputMaybe<Billing_Invoice_Aggregate_Bool_Exp>;
  client_billing_assignments?: InputMaybe<Client_Billing_Assignment_Bool_Exp>;
  client_billing_assignments_aggregate?: InputMaybe<Client_Billing_Assignment_Aggregate_Bool_Exp>;
  client_billing_invoices?: InputMaybe<Billing_Invoices_Bool_Exp>;
  client_billing_invoices_aggregate?: InputMaybe<Billing_Invoices_Aggregate_Bool_Exp>;
  client_external_systems?: InputMaybe<Client_External_Systems_Bool_Exp>;
  client_external_systems_aggregate?: InputMaybe<Client_External_Systems_Aggregate_Bool_Exp>;
  contact_email?: InputMaybe<String_Comparison_Exp>;
  contact_person?: InputMaybe<String_Comparison_Exp>;
  contact_phone?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  payrolls?: InputMaybe<Payrolls_Bool_Exp>;
  payrolls_aggregate?: InputMaybe<Payrolls_Aggregate_Bool_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "clients" */
export type Clients_Constraint =
  /** unique or primary key constraint on columns "id" */
  "clients_pkey";

/** input type for inserting data into table "clients" */
export type Clients_Insert_Input = {
  /** Whether the client is currently active */
  active?: InputMaybe<Scalars["Boolean"]["input"]>;
  billing_invoices?: InputMaybe<Billing_Invoice_Arr_Rel_Insert_Input>;
  client_billing_assignments?: InputMaybe<Client_Billing_Assignment_Arr_Rel_Insert_Input>;
  client_billing_invoices?: InputMaybe<Billing_Invoices_Arr_Rel_Insert_Input>;
  client_external_systems?: InputMaybe<Client_External_Systems_Arr_Rel_Insert_Input>;
  /** Email address for the client contact */
  contact_email?: InputMaybe<Scalars["String"]["input"]>;
  /** Primary contact person at the client */
  contact_person?: InputMaybe<Scalars["String"]["input"]>;
  /** Phone number for the client contact */
  contact_phone?: InputMaybe<Scalars["String"]["input"]>;
  /** Timestamp when the client was created */
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  /** Unique identifier for the client */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Client company name */
  name?: InputMaybe<Scalars["String"]["input"]>;
  payrolls?: InputMaybe<Payrolls_Arr_Rel_Insert_Input>;
  /** Timestamp when the client was last updated */
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** aggregate max on columns */
export type Clients_Max_Fields = {
  __typename: "clients_max_fields";
  /** Email address for the client contact */
  contact_email: Maybe<Scalars["String"]["output"]>;
  /** Primary contact person at the client */
  contact_person: Maybe<Scalars["String"]["output"]>;
  /** Phone number for the client contact */
  contact_phone: Maybe<Scalars["String"]["output"]>;
  /** Timestamp when the client was created */
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  /** Unique identifier for the client */
  id: Maybe<Scalars["uuid"]["output"]>;
  /** Client company name */
  name: Maybe<Scalars["String"]["output"]>;
  /** Timestamp when the client was last updated */
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
};

/** order by max() on columns of table "clients" */
export type Clients_Max_Order_By = {
  /** Email address for the client contact */
  contact_email?: InputMaybe<Order_By>;
  /** Primary contact person at the client */
  contact_person?: InputMaybe<Order_By>;
  /** Phone number for the client contact */
  contact_phone?: InputMaybe<Order_By>;
  /** Timestamp when the client was created */
  created_at?: InputMaybe<Order_By>;
  /** Unique identifier for the client */
  id?: InputMaybe<Order_By>;
  /** Client company name */
  name?: InputMaybe<Order_By>;
  /** Timestamp when the client was last updated */
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Clients_Min_Fields = {
  __typename: "clients_min_fields";
  /** Email address for the client contact */
  contact_email: Maybe<Scalars["String"]["output"]>;
  /** Primary contact person at the client */
  contact_person: Maybe<Scalars["String"]["output"]>;
  /** Phone number for the client contact */
  contact_phone: Maybe<Scalars["String"]["output"]>;
  /** Timestamp when the client was created */
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  /** Unique identifier for the client */
  id: Maybe<Scalars["uuid"]["output"]>;
  /** Client company name */
  name: Maybe<Scalars["String"]["output"]>;
  /** Timestamp when the client was last updated */
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
};

/** order by min() on columns of table "clients" */
export type Clients_Min_Order_By = {
  /** Email address for the client contact */
  contact_email?: InputMaybe<Order_By>;
  /** Primary contact person at the client */
  contact_person?: InputMaybe<Order_By>;
  /** Phone number for the client contact */
  contact_phone?: InputMaybe<Order_By>;
  /** Timestamp when the client was created */
  created_at?: InputMaybe<Order_By>;
  /** Unique identifier for the client */
  id?: InputMaybe<Order_By>;
  /** Client company name */
  name?: InputMaybe<Order_By>;
  /** Timestamp when the client was last updated */
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "clients" */
export type Clients_Mutation_Response = {
  __typename: "clients_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Clients>;
};

/** input type for inserting object relation for remote table "clients" */
export type Clients_Obj_Rel_Insert_Input = {
  data: Clients_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Clients_On_Conflict>;
};

/** on_conflict condition type for table "clients" */
export type Clients_On_Conflict = {
  constraint: Clients_Constraint;
  update_columns?: Array<Clients_Update_Column>;
  where?: InputMaybe<Clients_Bool_Exp>;
};

/** Ordering options when selecting data from "clients". */
export type Clients_Order_By = {
  active?: InputMaybe<Order_By>;
  billing_invoices_aggregate?: InputMaybe<Billing_Invoice_Aggregate_Order_By>;
  client_billing_assignments_aggregate?: InputMaybe<Client_Billing_Assignment_Aggregate_Order_By>;
  client_billing_invoices_aggregate?: InputMaybe<Billing_Invoices_Aggregate_Order_By>;
  client_external_systems_aggregate?: InputMaybe<Client_External_Systems_Aggregate_Order_By>;
  contact_email?: InputMaybe<Order_By>;
  contact_person?: InputMaybe<Order_By>;
  contact_phone?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  payrolls_aggregate?: InputMaybe<Payrolls_Aggregate_Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: clients */
export type Clients_Pk_Columns_Input = {
  /** Unique identifier for the client */
  id: Scalars["uuid"]["input"];
};

/** select columns of table "clients" */
export type Clients_Select_Column =
  /** column name */
  | "active"
  /** column name */
  | "contact_email"
  /** column name */
  | "contact_person"
  /** column name */
  | "contact_phone"
  /** column name */
  | "created_at"
  /** column name */
  | "id"
  /** column name */
  | "name"
  /** column name */
  | "updated_at";

/** select "clients_aggregate_bool_exp_bool_and_arguments_columns" columns of table "clients" */
export type Clients_Select_Column_Clients_Aggregate_Bool_Exp_Bool_And_Arguments_Columns =
  /** column name */
  "active";

/** select "clients_aggregate_bool_exp_bool_or_arguments_columns" columns of table "clients" */
export type Clients_Select_Column_Clients_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns =
  /** column name */
  "active";

/** input type for updating data in table "clients" */
export type Clients_Set_Input = {
  /** Whether the client is currently active */
  active?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Email address for the client contact */
  contact_email?: InputMaybe<Scalars["String"]["input"]>;
  /** Primary contact person at the client */
  contact_person?: InputMaybe<Scalars["String"]["input"]>;
  /** Phone number for the client contact */
  contact_phone?: InputMaybe<Scalars["String"]["input"]>;
  /** Timestamp when the client was created */
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  /** Unique identifier for the client */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Client company name */
  name?: InputMaybe<Scalars["String"]["input"]>;
  /** Timestamp when the client was last updated */
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** Streaming cursor of the table "clients" */
export type Clients_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Clients_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Clients_Stream_Cursor_Value_Input = {
  /** Whether the client is currently active */
  active?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Email address for the client contact */
  contact_email?: InputMaybe<Scalars["String"]["input"]>;
  /** Primary contact person at the client */
  contact_person?: InputMaybe<Scalars["String"]["input"]>;
  /** Phone number for the client contact */
  contact_phone?: InputMaybe<Scalars["String"]["input"]>;
  /** Timestamp when the client was created */
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  /** Unique identifier for the client */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Client company name */
  name?: InputMaybe<Scalars["String"]["input"]>;
  /** Timestamp when the client was last updated */
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** update columns of table "clients" */
export type Clients_Update_Column =
  /** column name */
  | "active"
  /** column name */
  | "contact_email"
  /** column name */
  | "contact_person"
  /** column name */
  | "contact_phone"
  /** column name */
  | "created_at"
  /** column name */
  | "id"
  /** column name */
  | "name"
  /** column name */
  | "updated_at";

export type Clients_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Clients_Set_Input>;
  /** filter the rows which have to be updated */
  where: Clients_Bool_Exp;
};

export type Create_Payroll_Version_Args = {
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

/** columns and relationships of "current_payrolls" */
export type Current_Payrolls = {
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
export type Current_Payrolls_Aggregate = {
  __typename: "current_payrolls_aggregate";
  aggregate: Maybe<Current_Payrolls_Aggregate_Fields>;
  nodes: Array<Current_Payrolls>;
};

/** aggregate fields of "current_payrolls" */
export type Current_Payrolls_Aggregate_Fields = {
  __typename: "current_payrolls_aggregate_fields";
  avg: Maybe<Current_Payrolls_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max: Maybe<Current_Payrolls_Max_Fields>;
  min: Maybe<Current_Payrolls_Min_Fields>;
  stddev: Maybe<Current_Payrolls_Stddev_Fields>;
  stddev_pop: Maybe<Current_Payrolls_Stddev_Pop_Fields>;
  stddev_samp: Maybe<Current_Payrolls_Stddev_Samp_Fields>;
  sum: Maybe<Current_Payrolls_Sum_Fields>;
  var_pop: Maybe<Current_Payrolls_Var_Pop_Fields>;
  var_samp: Maybe<Current_Payrolls_Var_Samp_Fields>;
  variance: Maybe<Current_Payrolls_Variance_Fields>;
};

/** aggregate fields of "current_payrolls" */
export type Current_Payrolls_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Current_Payrolls_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** aggregate avg on columns */
export type Current_Payrolls_Avg_Fields = {
  __typename: "current_payrolls_avg_fields";
  date_value: Maybe<Scalars["Float"]["output"]>;
  version_number: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to filter rows from the table "current_payrolls". All fields are combined with a logical 'AND'. */
export type Current_Payrolls_Bool_Exp = {
  _and?: InputMaybe<Array<Current_Payrolls_Bool_Exp>>;
  _not?: InputMaybe<Current_Payrolls_Bool_Exp>;
  _or?: InputMaybe<Array<Current_Payrolls_Bool_Exp>>;
  backup_consultant_user_id?: InputMaybe<Uuid_Comparison_Exp>;
  client_id?: InputMaybe<Uuid_Comparison_Exp>;
  client_name?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  cycle_id?: InputMaybe<Uuid_Comparison_Exp>;
  date_type_id?: InputMaybe<Uuid_Comparison_Exp>;
  date_value?: InputMaybe<Int_Comparison_Exp>;
  go_live_date?: InputMaybe<Date_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  manager_user_id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  parent_payroll_id?: InputMaybe<Uuid_Comparison_Exp>;
  payroll_cycle_name?: InputMaybe<Payroll_Cycle_Type_Comparison_Exp>;
  payroll_date_type_name?: InputMaybe<Payroll_Date_Type_Comparison_Exp>;
  primary_consultant_user_id?: InputMaybe<Uuid_Comparison_Exp>;
  superseded_date?: InputMaybe<Date_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  version_number?: InputMaybe<Int_Comparison_Exp>;
  version_reason?: InputMaybe<String_Comparison_Exp>;
};

/** aggregate max on columns */
export type Current_Payrolls_Max_Fields = {
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
export type Current_Payrolls_Min_Fields = {
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
export type Current_Payrolls_Order_By = {
  backup_consultant_user_id?: InputMaybe<Order_By>;
  client_id?: InputMaybe<Order_By>;
  client_name?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  cycle_id?: InputMaybe<Order_By>;
  date_type_id?: InputMaybe<Order_By>;
  date_value?: InputMaybe<Order_By>;
  go_live_date?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  manager_user_id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  parent_payroll_id?: InputMaybe<Order_By>;
  payroll_cycle_name?: InputMaybe<Order_By>;
  payroll_date_type_name?: InputMaybe<Order_By>;
  primary_consultant_user_id?: InputMaybe<Order_By>;
  superseded_date?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  version_number?: InputMaybe<Order_By>;
  version_reason?: InputMaybe<Order_By>;
};

/** select columns of table "current_payrolls" */
export type Current_Payrolls_Select_Column =
  /** column name */
  | "backup_consultant_user_id"
  /** column name */
  | "client_id"
  /** column name */
  | "client_name"
  /** column name */
  | "created_at"
  /** column name */
  | "cycle_id"
  /** column name */
  | "date_type_id"
  /** column name */
  | "date_value"
  /** column name */
  | "go_live_date"
  /** column name */
  | "id"
  /** column name */
  | "manager_user_id"
  /** column name */
  | "name"
  /** column name */
  | "parent_payroll_id"
  /** column name */
  | "payroll_cycle_name"
  /** column name */
  | "payroll_date_type_name"
  /** column name */
  | "primary_consultant_user_id"
  /** column name */
  | "superseded_date"
  /** column name */
  | "updated_at"
  /** column name */
  | "version_number"
  /** column name */
  | "version_reason";

/** aggregate stddev on columns */
export type Current_Payrolls_Stddev_Fields = {
  __typename: "current_payrolls_stddev_fields";
  date_value: Maybe<Scalars["Float"]["output"]>;
  version_number: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type Current_Payrolls_Stddev_Pop_Fields = {
  __typename: "current_payrolls_stddev_pop_fields";
  date_value: Maybe<Scalars["Float"]["output"]>;
  version_number: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type Current_Payrolls_Stddev_Samp_Fields = {
  __typename: "current_payrolls_stddev_samp_fields";
  date_value: Maybe<Scalars["Float"]["output"]>;
  version_number: Maybe<Scalars["Float"]["output"]>;
};

/** Streaming cursor of the table "current_payrolls" */
export type Current_Payrolls_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Current_Payrolls_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Current_Payrolls_Stream_Cursor_Value_Input = {
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
export type Current_Payrolls_Sum_Fields = {
  __typename: "current_payrolls_sum_fields";
  date_value: Maybe<Scalars["Int"]["output"]>;
  version_number: Maybe<Scalars["Int"]["output"]>;
};

/** aggregate var_pop on columns */
export type Current_Payrolls_Var_Pop_Fields = {
  __typename: "current_payrolls_var_pop_fields";
  date_value: Maybe<Scalars["Float"]["output"]>;
  version_number: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate var_samp on columns */
export type Current_Payrolls_Var_Samp_Fields = {
  __typename: "current_payrolls_var_samp_fields";
  date_value: Maybe<Scalars["Float"]["output"]>;
  version_number: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate variance on columns */
export type Current_Payrolls_Variance_Fields = {
  __typename: "current_payrolls_variance_fields";
  date_value: Maybe<Scalars["Float"]["output"]>;
  version_number: Maybe<Scalars["Float"]["output"]>;
};

/** ordering argument of a cursor */
export type Cursor_Ordering =
  /** ascending ordering of the cursor */
  | "ASC"
  /** descending ordering of the cursor */
  | "DESC";

/** Boolean expression to compare columns of type "date". All fields are combined with logical 'AND'. */
export type Date_Comparison_Exp = {
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
export type External_Systems = {
  __typename: "external_systems";
  /** An array relationship */
  client_external_systems: Array<Client_External_Systems>;
  /** An aggregate relationship */
  client_external_systems_aggregate: Client_External_Systems_Aggregate;
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
export type External_SystemsClient_External_SystemsArgs = {
  distinct_on?: InputMaybe<Array<Client_External_Systems_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Client_External_Systems_Order_By>>;
  where?: InputMaybe<Client_External_Systems_Bool_Exp>;
};

/** columns and relationships of "external_systems" */
export type External_SystemsClient_External_Systems_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Client_External_Systems_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Client_External_Systems_Order_By>>;
  where?: InputMaybe<Client_External_Systems_Bool_Exp>;
};

/** aggregated selection of "external_systems" */
export type External_Systems_Aggregate = {
  __typename: "external_systems_aggregate";
  aggregate: Maybe<External_Systems_Aggregate_Fields>;
  nodes: Array<External_Systems>;
};

/** aggregate fields of "external_systems" */
export type External_Systems_Aggregate_Fields = {
  __typename: "external_systems_aggregate_fields";
  count: Scalars["Int"]["output"];
  max: Maybe<External_Systems_Max_Fields>;
  min: Maybe<External_Systems_Min_Fields>;
};

/** aggregate fields of "external_systems" */
export type External_Systems_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<External_Systems_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** Boolean expression to filter rows from the table "external_systems". All fields are combined with a logical 'AND'. */
export type External_Systems_Bool_Exp = {
  _and?: InputMaybe<Array<External_Systems_Bool_Exp>>;
  _not?: InputMaybe<External_Systems_Bool_Exp>;
  _or?: InputMaybe<Array<External_Systems_Bool_Exp>>;
  client_external_systems?: InputMaybe<Client_External_Systems_Bool_Exp>;
  client_external_systems_aggregate?: InputMaybe<Client_External_Systems_Aggregate_Bool_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  icon?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  url?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "external_systems" */
export type External_Systems_Constraint =
  /** unique or primary key constraint on columns "id" */
  "external_systems_pkey";

/** input type for inserting data into table "external_systems" */
export type External_Systems_Insert_Input = {
  client_external_systems?: InputMaybe<Client_External_Systems_Arr_Rel_Insert_Input>;
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
export type External_Systems_Max_Fields = {
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
export type External_Systems_Min_Fields = {
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
export type External_Systems_Mutation_Response = {
  __typename: "external_systems_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<External_Systems>;
};

/** input type for inserting object relation for remote table "external_systems" */
export type External_Systems_Obj_Rel_Insert_Input = {
  data: External_Systems_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<External_Systems_On_Conflict>;
};

/** on_conflict condition type for table "external_systems" */
export type External_Systems_On_Conflict = {
  constraint: External_Systems_Constraint;
  update_columns?: Array<External_Systems_Update_Column>;
  where?: InputMaybe<External_Systems_Bool_Exp>;
};

/** Ordering options when selecting data from "external_systems". */
export type External_Systems_Order_By = {
  client_external_systems_aggregate?: InputMaybe<Client_External_Systems_Aggregate_Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  icon?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  url?: InputMaybe<Order_By>;
};

/** primary key columns input for table: external_systems */
export type External_Systems_Pk_Columns_Input = {
  /** Unique identifier for the external system */
  id: Scalars["uuid"]["input"];
};

/** select columns of table "external_systems" */
export type External_Systems_Select_Column =
  /** column name */
  | "created_at"
  /** column name */
  | "description"
  /** column name */
  | "icon"
  /** column name */
  | "id"
  /** column name */
  | "name"
  /** column name */
  | "updated_at"
  /** column name */
  | "url";

/** input type for updating data in table "external_systems" */
export type External_Systems_Set_Input = {
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
export type External_Systems_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: External_Systems_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type External_Systems_Stream_Cursor_Value_Input = {
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
export type External_Systems_Update_Column =
  /** column name */
  | "created_at"
  /** column name */
  | "description"
  /** column name */
  | "icon"
  /** column name */
  | "id"
  /** column name */
  | "name"
  /** column name */
  | "updated_at"
  /** column name */
  | "url";

export type External_Systems_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<External_Systems_Set_Input>;
  /** filter the rows which have to be updated */
  where: External_Systems_Bool_Exp;
};

/** columns and relationships of "feature_flags" */
export type Feature_Flags = {
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
export type Feature_FlagsAllowed_RolesArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregated selection of "feature_flags" */
export type Feature_Flags_Aggregate = {
  __typename: "feature_flags_aggregate";
  aggregate: Maybe<Feature_Flags_Aggregate_Fields>;
  nodes: Array<Feature_Flags>;
};

/** aggregate fields of "feature_flags" */
export type Feature_Flags_Aggregate_Fields = {
  __typename: "feature_flags_aggregate_fields";
  count: Scalars["Int"]["output"];
  max: Maybe<Feature_Flags_Max_Fields>;
  min: Maybe<Feature_Flags_Min_Fields>;
};

/** aggregate fields of "feature_flags" */
export type Feature_Flags_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Feature_Flags_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Feature_Flags_Append_Input = {
  /** JSON array of roles that can access this feature */
  allowed_roles?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** Boolean expression to filter rows from the table "feature_flags". All fields are combined with a logical 'AND'. */
export type Feature_Flags_Bool_Exp = {
  _and?: InputMaybe<Array<Feature_Flags_Bool_Exp>>;
  _not?: InputMaybe<Feature_Flags_Bool_Exp>;
  _or?: InputMaybe<Array<Feature_Flags_Bool_Exp>>;
  allowed_roles?: InputMaybe<Jsonb_Comparison_Exp>;
  feature_name?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  is_enabled?: InputMaybe<Boolean_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "feature_flags" */
export type Feature_Flags_Constraint =
  /** unique or primary key constraint on columns "feature_name" */
  | "feature_flags_feature_name_key"
  /** unique or primary key constraint on columns "id" */
  | "feature_flags_pkey";

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Feature_Flags_Delete_At_Path_Input = {
  /** JSON array of roles that can access this feature */
  allowed_roles?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Feature_Flags_Delete_Elem_Input = {
  /** JSON array of roles that can access this feature */
  allowed_roles?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Feature_Flags_Delete_Key_Input = {
  /** JSON array of roles that can access this feature */
  allowed_roles?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for inserting data into table "feature_flags" */
export type Feature_Flags_Insert_Input = {
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
export type Feature_Flags_Max_Fields = {
  __typename: "feature_flags_max_fields";
  /** Name of the feature controlled by this flag */
  feature_name: Maybe<Scalars["String"]["output"]>;
  /** Unique identifier for the feature flag */
  id: Maybe<Scalars["uuid"]["output"]>;
  /** Timestamp when the feature flag was last updated */
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
};

/** aggregate min on columns */
export type Feature_Flags_Min_Fields = {
  __typename: "feature_flags_min_fields";
  /** Name of the feature controlled by this flag */
  feature_name: Maybe<Scalars["String"]["output"]>;
  /** Unique identifier for the feature flag */
  id: Maybe<Scalars["uuid"]["output"]>;
  /** Timestamp when the feature flag was last updated */
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
};

/** response of any mutation on the table "feature_flags" */
export type Feature_Flags_Mutation_Response = {
  __typename: "feature_flags_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Feature_Flags>;
};

/** on_conflict condition type for table "feature_flags" */
export type Feature_Flags_On_Conflict = {
  constraint: Feature_Flags_Constraint;
  update_columns?: Array<Feature_Flags_Update_Column>;
  where?: InputMaybe<Feature_Flags_Bool_Exp>;
};

/** Ordering options when selecting data from "feature_flags". */
export type Feature_Flags_Order_By = {
  allowed_roles?: InputMaybe<Order_By>;
  feature_name?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_enabled?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: feature_flags */
export type Feature_Flags_Pk_Columns_Input = {
  /** Unique identifier for the feature flag */
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Feature_Flags_Prepend_Input = {
  /** JSON array of roles that can access this feature */
  allowed_roles?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "feature_flags" */
export type Feature_Flags_Select_Column =
  /** column name */
  | "allowed_roles"
  /** column name */
  | "feature_name"
  /** column name */
  | "id"
  /** column name */
  | "is_enabled"
  /** column name */
  | "updated_at";

/** input type for updating data in table "feature_flags" */
export type Feature_Flags_Set_Input = {
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
export type Feature_Flags_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Feature_Flags_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Feature_Flags_Stream_Cursor_Value_Input = {
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
export type Feature_Flags_Update_Column =
  /** column name */
  | "allowed_roles"
  /** column name */
  | "feature_name"
  /** column name */
  | "id"
  /** column name */
  | "is_enabled"
  /** column name */
  | "updated_at";

export type Feature_Flags_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Feature_Flags_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Feature_Flags_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Feature_Flags_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Feature_Flags_Delete_Key_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Feature_Flags_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Feature_Flags_Set_Input>;
  /** filter the rows which have to be updated */
  where: Feature_Flags_Bool_Exp;
};

export type Generate_Payroll_Dates_Args = {
  p_end_date?: InputMaybe<Scalars["date"]["input"]>;
  p_max_dates?: InputMaybe<Scalars["Int"]["input"]>;
  p_payroll_id?: InputMaybe<Scalars["uuid"]["input"]>;
  p_start_date?: InputMaybe<Scalars["date"]["input"]>;
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
export type Holidays_Aggregate = {
  __typename: "holidays_aggregate";
  aggregate: Maybe<Holidays_Aggregate_Fields>;
  nodes: Array<Holidays>;
};

/** aggregate fields of "holidays" */
export type Holidays_Aggregate_Fields = {
  __typename: "holidays_aggregate_fields";
  avg: Maybe<Holidays_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max: Maybe<Holidays_Max_Fields>;
  min: Maybe<Holidays_Min_Fields>;
  stddev: Maybe<Holidays_Stddev_Fields>;
  stddev_pop: Maybe<Holidays_Stddev_Pop_Fields>;
  stddev_samp: Maybe<Holidays_Stddev_Samp_Fields>;
  sum: Maybe<Holidays_Sum_Fields>;
  var_pop: Maybe<Holidays_Var_Pop_Fields>;
  var_samp: Maybe<Holidays_Var_Samp_Fields>;
  variance: Maybe<Holidays_Variance_Fields>;
};

/** aggregate fields of "holidays" */
export type Holidays_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Holidays_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** aggregate avg on columns */
export type Holidays_Avg_Fields = {
  __typename: "holidays_avg_fields";
  /** First year when the holiday was observed */
  launch_year: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to filter rows from the table "holidays". All fields are combined with a logical 'AND'. */
export type Holidays_Bool_Exp = {
  _and?: InputMaybe<Array<Holidays_Bool_Exp>>;
  _not?: InputMaybe<Holidays_Bool_Exp>;
  _or?: InputMaybe<Array<Holidays_Bool_Exp>>;
  country_code?: InputMaybe<Bpchar_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  date?: InputMaybe<Date_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  is_fixed?: InputMaybe<Boolean_Comparison_Exp>;
  is_global?: InputMaybe<Boolean_Comparison_Exp>;
  launch_year?: InputMaybe<Int_Comparison_Exp>;
  local_name?: InputMaybe<String_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  region?: InputMaybe<String_Array_Comparison_Exp>;
  types?: InputMaybe<String_Array_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "holidays" */
export type Holidays_Constraint =
  /** unique or primary key constraint on columns "id" */
  "holidays_pkey";

/** input type for incrementing numeric columns in table "holidays" */
export type Holidays_Inc_Input = {
  /** First year when the holiday was observed */
  launch_year?: InputMaybe<Scalars["Int"]["input"]>;
};

/** input type for inserting data into table "holidays" */
export type Holidays_Insert_Input = {
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
export type Holidays_Max_Fields = {
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
export type Holidays_Min_Fields = {
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
export type Holidays_Mutation_Response = {
  __typename: "holidays_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Holidays>;
};

/** on_conflict condition type for table "holidays" */
export type Holidays_On_Conflict = {
  constraint: Holidays_Constraint;
  update_columns?: Array<Holidays_Update_Column>;
  where?: InputMaybe<Holidays_Bool_Exp>;
};

/** Ordering options when selecting data from "holidays". */
export type Holidays_Order_By = {
  country_code?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  date?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_fixed?: InputMaybe<Order_By>;
  is_global?: InputMaybe<Order_By>;
  launch_year?: InputMaybe<Order_By>;
  local_name?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  region?: InputMaybe<Order_By>;
  types?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: holidays */
export type Holidays_Pk_Columns_Input = {
  /** Unique identifier for the holiday */
  id: Scalars["uuid"]["input"];
};

/** select columns of table "holidays" */
export type Holidays_Select_Column =
  /** column name */
  | "country_code"
  /** column name */
  | "created_at"
  /** column name */
  | "date"
  /** column name */
  | "id"
  /** column name */
  | "is_fixed"
  /** column name */
  | "is_global"
  /** column name */
  | "launch_year"
  /** column name */
  | "local_name"
  /** column name */
  | "name"
  /** column name */
  | "region"
  /** column name */
  | "types"
  /** column name */
  | "updated_at";

/** input type for updating data in table "holidays" */
export type Holidays_Set_Input = {
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
export type Holidays_Stddev_Fields = {
  __typename: "holidays_stddev_fields";
  /** First year when the holiday was observed */
  launch_year: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type Holidays_Stddev_Pop_Fields = {
  __typename: "holidays_stddev_pop_fields";
  /** First year when the holiday was observed */
  launch_year: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type Holidays_Stddev_Samp_Fields = {
  __typename: "holidays_stddev_samp_fields";
  /** First year when the holiday was observed */
  launch_year: Maybe<Scalars["Float"]["output"]>;
};

/** Streaming cursor of the table "holidays" */
export type Holidays_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Holidays_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Holidays_Stream_Cursor_Value_Input = {
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
export type Holidays_Sum_Fields = {
  __typename: "holidays_sum_fields";
  /** First year when the holiday was observed */
  launch_year: Maybe<Scalars["Int"]["output"]>;
};

/** update columns of table "holidays" */
export type Holidays_Update_Column =
  /** column name */
  | "country_code"
  /** column name */
  | "created_at"
  /** column name */
  | "date"
  /** column name */
  | "id"
  /** column name */
  | "is_fixed"
  /** column name */
  | "is_global"
  /** column name */
  | "launch_year"
  /** column name */
  | "local_name"
  /** column name */
  | "name"
  /** column name */
  | "region"
  /** column name */
  | "types"
  /** column name */
  | "updated_at";

export type Holidays_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Holidays_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Holidays_Set_Input>;
  /** filter the rows which have to be updated */
  where: Holidays_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Holidays_Var_Pop_Fields = {
  __typename: "holidays_var_pop_fields";
  /** First year when the holiday was observed */
  launch_year: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate var_samp on columns */
export type Holidays_Var_Samp_Fields = {
  __typename: "holidays_var_samp_fields";
  /** First year when the holiday was observed */
  launch_year: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate variance on columns */
export type Holidays_Variance_Fields = {
  __typename: "holidays_variance_fields";
  /** First year when the holiday was observed */
  launch_year: Maybe<Scalars["Float"]["output"]>;
};

export type Jsonb_Cast_Exp = {
  String?: InputMaybe<String_Comparison_Exp>;
};

/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export type Jsonb_Comparison_Exp = {
  _cast?: InputMaybe<Jsonb_Cast_Exp>;
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
export type Latest_Payroll_Version_Results = {
  __typename: "latest_payroll_version_results";
  active: Scalars["Boolean"]["output"];
  go_live_date: Maybe<Scalars["date"]["output"]>;
  id: Scalars["uuid"]["output"];
  name: Scalars["String"]["output"];
  payroll_id: Scalars["uuid"]["output"];
  queried_at: Maybe<Scalars["timestamptz"]["output"]>;
  version_number: Scalars["Int"]["output"];
};

/** aggregated selection of "latest_payroll_version_results" */
export type Latest_Payroll_Version_Results_Aggregate = {
  __typename: "latest_payroll_version_results_aggregate";
  aggregate: Maybe<Latest_Payroll_Version_Results_Aggregate_Fields>;
  nodes: Array<Latest_Payroll_Version_Results>;
};

/** aggregate fields of "latest_payroll_version_results" */
export type Latest_Payroll_Version_Results_Aggregate_Fields = {
  __typename: "latest_payroll_version_results_aggregate_fields";
  avg: Maybe<Latest_Payroll_Version_Results_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max: Maybe<Latest_Payroll_Version_Results_Max_Fields>;
  min: Maybe<Latest_Payroll_Version_Results_Min_Fields>;
  stddev: Maybe<Latest_Payroll_Version_Results_Stddev_Fields>;
  stddev_pop: Maybe<Latest_Payroll_Version_Results_Stddev_Pop_Fields>;
  stddev_samp: Maybe<Latest_Payroll_Version_Results_Stddev_Samp_Fields>;
  sum: Maybe<Latest_Payroll_Version_Results_Sum_Fields>;
  var_pop: Maybe<Latest_Payroll_Version_Results_Var_Pop_Fields>;
  var_samp: Maybe<Latest_Payroll_Version_Results_Var_Samp_Fields>;
  variance: Maybe<Latest_Payroll_Version_Results_Variance_Fields>;
};

/** aggregate fields of "latest_payroll_version_results" */
export type Latest_Payroll_Version_Results_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Latest_Payroll_Version_Results_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** aggregate avg on columns */
export type Latest_Payroll_Version_Results_Avg_Fields = {
  __typename: "latest_payroll_version_results_avg_fields";
  version_number: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to filter rows from the table "latest_payroll_version_results". All fields are combined with a logical 'AND'. */
export type Latest_Payroll_Version_Results_Bool_Exp = {
  _and?: InputMaybe<Array<Latest_Payroll_Version_Results_Bool_Exp>>;
  _not?: InputMaybe<Latest_Payroll_Version_Results_Bool_Exp>;
  _or?: InputMaybe<Array<Latest_Payroll_Version_Results_Bool_Exp>>;
  active?: InputMaybe<Boolean_Comparison_Exp>;
  go_live_date?: InputMaybe<Date_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  payroll_id?: InputMaybe<Uuid_Comparison_Exp>;
  queried_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  version_number?: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "latest_payroll_version_results" */
export type Latest_Payroll_Version_Results_Constraint =
  /** unique or primary key constraint on columns "id" */
  "latest_payroll_version_results_pkey";

/** input type for incrementing numeric columns in table "latest_payroll_version_results" */
export type Latest_Payroll_Version_Results_Inc_Input = {
  version_number?: InputMaybe<Scalars["Int"]["input"]>;
};

/** input type for inserting data into table "latest_payroll_version_results" */
export type Latest_Payroll_Version_Results_Insert_Input = {
  active?: InputMaybe<Scalars["Boolean"]["input"]>;
  go_live_date?: InputMaybe<Scalars["date"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  payroll_id?: InputMaybe<Scalars["uuid"]["input"]>;
  queried_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  version_number?: InputMaybe<Scalars["Int"]["input"]>;
};

/** aggregate max on columns */
export type Latest_Payroll_Version_Results_Max_Fields = {
  __typename: "latest_payroll_version_results_max_fields";
  go_live_date: Maybe<Scalars["date"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  name: Maybe<Scalars["String"]["output"]>;
  payroll_id: Maybe<Scalars["uuid"]["output"]>;
  queried_at: Maybe<Scalars["timestamptz"]["output"]>;
  version_number: Maybe<Scalars["Int"]["output"]>;
};

/** aggregate min on columns */
export type Latest_Payroll_Version_Results_Min_Fields = {
  __typename: "latest_payroll_version_results_min_fields";
  go_live_date: Maybe<Scalars["date"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  name: Maybe<Scalars["String"]["output"]>;
  payroll_id: Maybe<Scalars["uuid"]["output"]>;
  queried_at: Maybe<Scalars["timestamptz"]["output"]>;
  version_number: Maybe<Scalars["Int"]["output"]>;
};

/** response of any mutation on the table "latest_payroll_version_results" */
export type Latest_Payroll_Version_Results_Mutation_Response = {
  __typename: "latest_payroll_version_results_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Latest_Payroll_Version_Results>;
};

/** on_conflict condition type for table "latest_payroll_version_results" */
export type Latest_Payroll_Version_Results_On_Conflict = {
  constraint: Latest_Payroll_Version_Results_Constraint;
  update_columns?: Array<Latest_Payroll_Version_Results_Update_Column>;
  where?: InputMaybe<Latest_Payroll_Version_Results_Bool_Exp>;
};

/** Ordering options when selecting data from "latest_payroll_version_results". */
export type Latest_Payroll_Version_Results_Order_By = {
  active?: InputMaybe<Order_By>;
  go_live_date?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  payroll_id?: InputMaybe<Order_By>;
  queried_at?: InputMaybe<Order_By>;
  version_number?: InputMaybe<Order_By>;
};

/** primary key columns input for table: latest_payroll_version_results */
export type Latest_Payroll_Version_Results_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "latest_payroll_version_results" */
export type Latest_Payroll_Version_Results_Select_Column =
  /** column name */
  | "active"
  /** column name */
  | "go_live_date"
  /** column name */
  | "id"
  /** column name */
  | "name"
  /** column name */
  | "payroll_id"
  /** column name */
  | "queried_at"
  /** column name */
  | "version_number";

/** input type for updating data in table "latest_payroll_version_results" */
export type Latest_Payroll_Version_Results_Set_Input = {
  active?: InputMaybe<Scalars["Boolean"]["input"]>;
  go_live_date?: InputMaybe<Scalars["date"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  payroll_id?: InputMaybe<Scalars["uuid"]["input"]>;
  queried_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  version_number?: InputMaybe<Scalars["Int"]["input"]>;
};

/** aggregate stddev on columns */
export type Latest_Payroll_Version_Results_Stddev_Fields = {
  __typename: "latest_payroll_version_results_stddev_fields";
  version_number: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type Latest_Payroll_Version_Results_Stddev_Pop_Fields = {
  __typename: "latest_payroll_version_results_stddev_pop_fields";
  version_number: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type Latest_Payroll_Version_Results_Stddev_Samp_Fields = {
  __typename: "latest_payroll_version_results_stddev_samp_fields";
  version_number: Maybe<Scalars["Float"]["output"]>;
};

/** Streaming cursor of the table "latest_payroll_version_results" */
export type Latest_Payroll_Version_Results_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Latest_Payroll_Version_Results_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Latest_Payroll_Version_Results_Stream_Cursor_Value_Input = {
  active?: InputMaybe<Scalars["Boolean"]["input"]>;
  go_live_date?: InputMaybe<Scalars["date"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  payroll_id?: InputMaybe<Scalars["uuid"]["input"]>;
  queried_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  version_number?: InputMaybe<Scalars["Int"]["input"]>;
};

/** aggregate sum on columns */
export type Latest_Payroll_Version_Results_Sum_Fields = {
  __typename: "latest_payroll_version_results_sum_fields";
  version_number: Maybe<Scalars["Int"]["output"]>;
};

/** update columns of table "latest_payroll_version_results" */
export type Latest_Payroll_Version_Results_Update_Column =
  /** column name */
  | "active"
  /** column name */
  | "go_live_date"
  /** column name */
  | "id"
  /** column name */
  | "name"
  /** column name */
  | "payroll_id"
  /** column name */
  | "queried_at"
  /** column name */
  | "version_number";

export type Latest_Payroll_Version_Results_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Latest_Payroll_Version_Results_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Latest_Payroll_Version_Results_Set_Input>;
  /** filter the rows which have to be updated */
  where: Latest_Payroll_Version_Results_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Latest_Payroll_Version_Results_Var_Pop_Fields = {
  __typename: "latest_payroll_version_results_var_pop_fields";
  version_number: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate var_samp on columns */
export type Latest_Payroll_Version_Results_Var_Samp_Fields = {
  __typename: "latest_payroll_version_results_var_samp_fields";
  version_number: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate variance on columns */
export type Latest_Payroll_Version_Results_Variance_Fields = {
  __typename: "latest_payroll_version_results_variance_fields";
  version_number: Maybe<Scalars["Float"]["output"]>;
};

/** columns and relationships of "leave" */
export type Leave = {
  __typename: "leave";
  /** Last day of the leave period */
  end_date: Scalars["date"]["output"];
  /** Unique identifier for the leave record */
  id: Scalars["uuid"]["output"];
  /** Type of leave (vacation, sick, personal, etc.) */
  leave_type: Scalars["String"]["output"];
  /** An object relationship */
  leave_user: Users;
  /** Reason provided for the leave request */
  reason: Maybe<Scalars["String"]["output"]>;
  /** First day of the leave period */
  start_date: Scalars["date"]["output"];
  /** Current status of the leave request (Pending, Approved, Denied) */
  status: Maybe<Scalars["leave_status_enum"]["output"]>;
  /** An object relationship */
  user: Users;
  /** Reference to the user taking leave */
  user_id: Scalars["uuid"]["output"];
};

/** aggregated selection of "leave" */
export type Leave_Aggregate = {
  __typename: "leave_aggregate";
  aggregate: Maybe<Leave_Aggregate_Fields>;
  nodes: Array<Leave>;
};

export type Leave_Aggregate_Bool_Exp = {
  count?: InputMaybe<Leave_Aggregate_Bool_Exp_Count>;
};

export type Leave_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Leave_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Leave_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "leave" */
export type Leave_Aggregate_Fields = {
  __typename: "leave_aggregate_fields";
  count: Scalars["Int"]["output"];
  max: Maybe<Leave_Max_Fields>;
  min: Maybe<Leave_Min_Fields>;
};

/** aggregate fields of "leave" */
export type Leave_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Leave_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "leave" */
export type Leave_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Leave_Max_Order_By>;
  min?: InputMaybe<Leave_Min_Order_By>;
};

/** input type for inserting array relation for remote table "leave" */
export type Leave_Arr_Rel_Insert_Input = {
  data: Array<Leave_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Leave_On_Conflict>;
};

/** Boolean expression to filter rows from the table "leave". All fields are combined with a logical 'AND'. */
export type Leave_Bool_Exp = {
  _and?: InputMaybe<Array<Leave_Bool_Exp>>;
  _not?: InputMaybe<Leave_Bool_Exp>;
  _or?: InputMaybe<Array<Leave_Bool_Exp>>;
  end_date?: InputMaybe<Date_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  leave_type?: InputMaybe<String_Comparison_Exp>;
  leave_user?: InputMaybe<Users_Bool_Exp>;
  reason?: InputMaybe<String_Comparison_Exp>;
  start_date?: InputMaybe<Date_Comparison_Exp>;
  status?: InputMaybe<Leave_Status_Enum_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "leave" */
export type Leave_Constraint =
  /** unique or primary key constraint on columns "id" */
  "leave_pkey";

/** input type for inserting data into table "leave" */
export type Leave_Insert_Input = {
  /** Last day of the leave period */
  end_date?: InputMaybe<Scalars["date"]["input"]>;
  /** Unique identifier for the leave record */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Type of leave (vacation, sick, personal, etc.) */
  leave_type?: InputMaybe<Scalars["String"]["input"]>;
  leave_user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  /** Reason provided for the leave request */
  reason?: InputMaybe<Scalars["String"]["input"]>;
  /** First day of the leave period */
  start_date?: InputMaybe<Scalars["date"]["input"]>;
  /** Current status of the leave request (Pending, Approved, Denied) */
  status?: InputMaybe<Scalars["leave_status_enum"]["input"]>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  /** Reference to the user taking leave */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Leave_Max_Fields = {
  __typename: "leave_max_fields";
  /** Last day of the leave period */
  end_date: Maybe<Scalars["date"]["output"]>;
  /** Unique identifier for the leave record */
  id: Maybe<Scalars["uuid"]["output"]>;
  /** Type of leave (vacation, sick, personal, etc.) */
  leave_type: Maybe<Scalars["String"]["output"]>;
  /** Reason provided for the leave request */
  reason: Maybe<Scalars["String"]["output"]>;
  /** First day of the leave period */
  start_date: Maybe<Scalars["date"]["output"]>;
  /** Current status of the leave request (Pending, Approved, Denied) */
  status: Maybe<Scalars["leave_status_enum"]["output"]>;
  /** Reference to the user taking leave */
  user_id: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "leave" */
export type Leave_Max_Order_By = {
  /** Last day of the leave period */
  end_date?: InputMaybe<Order_By>;
  /** Unique identifier for the leave record */
  id?: InputMaybe<Order_By>;
  /** Type of leave (vacation, sick, personal, etc.) */
  leave_type?: InputMaybe<Order_By>;
  /** Reason provided for the leave request */
  reason?: InputMaybe<Order_By>;
  /** First day of the leave period */
  start_date?: InputMaybe<Order_By>;
  /** Current status of the leave request (Pending, Approved, Denied) */
  status?: InputMaybe<Order_By>;
  /** Reference to the user taking leave */
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Leave_Min_Fields = {
  __typename: "leave_min_fields";
  /** Last day of the leave period */
  end_date: Maybe<Scalars["date"]["output"]>;
  /** Unique identifier for the leave record */
  id: Maybe<Scalars["uuid"]["output"]>;
  /** Type of leave (vacation, sick, personal, etc.) */
  leave_type: Maybe<Scalars["String"]["output"]>;
  /** Reason provided for the leave request */
  reason: Maybe<Scalars["String"]["output"]>;
  /** First day of the leave period */
  start_date: Maybe<Scalars["date"]["output"]>;
  /** Current status of the leave request (Pending, Approved, Denied) */
  status: Maybe<Scalars["leave_status_enum"]["output"]>;
  /** Reference to the user taking leave */
  user_id: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "leave" */
export type Leave_Min_Order_By = {
  /** Last day of the leave period */
  end_date?: InputMaybe<Order_By>;
  /** Unique identifier for the leave record */
  id?: InputMaybe<Order_By>;
  /** Type of leave (vacation, sick, personal, etc.) */
  leave_type?: InputMaybe<Order_By>;
  /** Reason provided for the leave request */
  reason?: InputMaybe<Order_By>;
  /** First day of the leave period */
  start_date?: InputMaybe<Order_By>;
  /** Current status of the leave request (Pending, Approved, Denied) */
  status?: InputMaybe<Order_By>;
  /** Reference to the user taking leave */
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "leave" */
export type Leave_Mutation_Response = {
  __typename: "leave_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Leave>;
};

/** on_conflict condition type for table "leave" */
export type Leave_On_Conflict = {
  constraint: Leave_Constraint;
  update_columns?: Array<Leave_Update_Column>;
  where?: InputMaybe<Leave_Bool_Exp>;
};

/** Ordering options when selecting data from "leave". */
export type Leave_Order_By = {
  end_date?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  leave_type?: InputMaybe<Order_By>;
  leave_user?: InputMaybe<Users_Order_By>;
  reason?: InputMaybe<Order_By>;
  start_date?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: leave */
export type Leave_Pk_Columns_Input = {
  /** Unique identifier for the leave record */
  id: Scalars["uuid"]["input"];
};

/** select columns of table "leave" */
export type Leave_Select_Column =
  /** column name */
  | "end_date"
  /** column name */
  | "id"
  /** column name */
  | "leave_type"
  /** column name */
  | "reason"
  /** column name */
  | "start_date"
  /** column name */
  | "status"
  /** column name */
  | "user_id";

/** input type for updating data in table "leave" */
export type Leave_Set_Input = {
  /** Last day of the leave period */
  end_date?: InputMaybe<Scalars["date"]["input"]>;
  /** Unique identifier for the leave record */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Type of leave (vacation, sick, personal, etc.) */
  leave_type?: InputMaybe<Scalars["String"]["input"]>;
  /** Reason provided for the leave request */
  reason?: InputMaybe<Scalars["String"]["input"]>;
  /** First day of the leave period */
  start_date?: InputMaybe<Scalars["date"]["input"]>;
  /** Current status of the leave request (Pending, Approved, Denied) */
  status?: InputMaybe<Scalars["leave_status_enum"]["input"]>;
  /** Reference to the user taking leave */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** Boolean expression to compare columns of type "leave_status_enum". All fields are combined with logical 'AND'. */
export type Leave_Status_Enum_Comparison_Exp = {
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
export type Leave_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Leave_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Leave_Stream_Cursor_Value_Input = {
  /** Last day of the leave period */
  end_date?: InputMaybe<Scalars["date"]["input"]>;
  /** Unique identifier for the leave record */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Type of leave (vacation, sick, personal, etc.) */
  leave_type?: InputMaybe<Scalars["String"]["input"]>;
  /** Reason provided for the leave request */
  reason?: InputMaybe<Scalars["String"]["input"]>;
  /** First day of the leave period */
  start_date?: InputMaybe<Scalars["date"]["input"]>;
  /** Current status of the leave request (Pending, Approved, Denied) */
  status?: InputMaybe<Scalars["leave_status_enum"]["input"]>;
  /** Reference to the user taking leave */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** update columns of table "leave" */
export type Leave_Update_Column =
  /** column name */
  | "end_date"
  /** column name */
  | "id"
  /** column name */
  | "leave_type"
  /** column name */
  | "reason"
  /** column name */
  | "start_date"
  /** column name */
  | "status"
  /** column name */
  | "user_id";

export type Leave_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Leave_Set_Input>;
  /** filter the rows which have to be updated */
  where: Leave_Bool_Exp;
};

/** mutation root */
export type Mutation_Root = {
  __typename: "mutation_root";
  commitPayrollAssignments: Maybe<CommitPayrollAssignmentsOutput>;
  /** delete data from the table: "adjustment_rules" */
  delete_adjustment_rules: Maybe<Adjustment_Rules_Mutation_Response>;
  /** delete single row from the table: "adjustment_rules" */
  delete_adjustment_rules_by_pk: Maybe<Adjustment_Rules>;
  /** delete data from the table: "app_settings" */
  delete_app_settings: Maybe<App_Settings_Mutation_Response>;
  /** delete single row from the table: "app_settings" */
  delete_app_settings_by_pk: Maybe<App_Settings>;
  /** delete data from the table: "billing_event_log" */
  delete_billing_event_log: Maybe<Billing_Event_Log_Mutation_Response>;
  /** delete single row from the table: "billing_event_log" */
  delete_billing_event_log_by_pk: Maybe<Billing_Event_Log>;
  /** delete data from the table: "billing_invoice" */
  delete_billing_invoice: Maybe<Billing_Invoice_Mutation_Response>;
  /** delete single row from the table: "billing_invoice" */
  delete_billing_invoice_by_pk: Maybe<Billing_Invoice>;
  /** delete data from the table: "billing_invoice_item" */
  delete_billing_invoice_item: Maybe<Billing_Invoice_Item_Mutation_Response>;
  /** delete single row from the table: "billing_invoice_item" */
  delete_billing_invoice_item_by_pk: Maybe<Billing_Invoice_Item>;
  /** delete data from the table: "billing_invoices" */
  delete_billing_invoices: Maybe<Billing_Invoices_Mutation_Response>;
  /** delete single row from the table: "billing_invoices" */
  delete_billing_invoices_by_pk: Maybe<Billing_Invoices>;
  /** delete data from the table: "billing_items" */
  delete_billing_items: Maybe<Billing_Items_Mutation_Response>;
  /** delete single row from the table: "billing_items" */
  delete_billing_items_by_pk: Maybe<Billing_Items>;
  /** delete data from the table: "billing_plan" */
  delete_billing_plan: Maybe<Billing_Plan_Mutation_Response>;
  /** delete single row from the table: "billing_plan" */
  delete_billing_plan_by_pk: Maybe<Billing_Plan>;
  /** delete data from the table: "client_billing_assignment" */
  delete_client_billing_assignment: Maybe<Client_Billing_Assignment_Mutation_Response>;
  /** delete single row from the table: "client_billing_assignment" */
  delete_client_billing_assignment_by_pk: Maybe<Client_Billing_Assignment>;
  /** delete data from the table: "client_external_systems" */
  delete_client_external_systems: Maybe<Client_External_Systems_Mutation_Response>;
  /** delete single row from the table: "client_external_systems" */
  delete_client_external_systems_by_pk: Maybe<Client_External_Systems>;
  /** delete data from the table: "clients" */
  delete_clients: Maybe<Clients_Mutation_Response>;
  /** delete single row from the table: "clients" */
  delete_clients_by_pk: Maybe<Clients>;
  /** delete data from the table: "external_systems" */
  delete_external_systems: Maybe<External_Systems_Mutation_Response>;
  /** delete single row from the table: "external_systems" */
  delete_external_systems_by_pk: Maybe<External_Systems>;
  /** delete data from the table: "feature_flags" */
  delete_feature_flags: Maybe<Feature_Flags_Mutation_Response>;
  /** delete single row from the table: "feature_flags" */
  delete_feature_flags_by_pk: Maybe<Feature_Flags>;
  /** delete data from the table: "holidays" */
  delete_holidays: Maybe<Holidays_Mutation_Response>;
  /** delete single row from the table: "holidays" */
  delete_holidays_by_pk: Maybe<Holidays>;
  /** delete data from the table: "latest_payroll_version_results" */
  delete_latest_payroll_version_results: Maybe<Latest_Payroll_Version_Results_Mutation_Response>;
  /** delete single row from the table: "latest_payroll_version_results" */
  delete_latest_payroll_version_results_by_pk: Maybe<Latest_Payroll_Version_Results>;
  /** delete data from the table: "leave" */
  delete_leave: Maybe<Leave_Mutation_Response>;
  /** delete single row from the table: "leave" */
  delete_leave_by_pk: Maybe<Leave>;
  /** delete data from the table: "neon_auth.users_sync" */
  delete_neon_auth_users_sync: Maybe<Neon_Auth_Users_Sync_Mutation_Response>;
  /** delete single row from the table: "neon_auth.users_sync" */
  delete_neon_auth_users_sync_by_pk: Maybe<Neon_Auth_Users_Sync>;
  /** delete data from the table: "notes" */
  delete_notes: Maybe<Notes_Mutation_Response>;
  /** delete single row from the table: "notes" */
  delete_notes_by_pk: Maybe<Notes>;
  /** delete data from the table: "payroll_activation_results" */
  delete_payroll_activation_results: Maybe<Payroll_Activation_Results_Mutation_Response>;
  /** delete single row from the table: "payroll_activation_results" */
  delete_payroll_activation_results_by_pk: Maybe<Payroll_Activation_Results>;
  /** delete data from the table: "payroll_cycles" */
  delete_payroll_cycles: Maybe<Payroll_Cycles_Mutation_Response>;
  /** delete single row from the table: "payroll_cycles" */
  delete_payroll_cycles_by_pk: Maybe<Payroll_Cycles>;
  /** delete data from the table: "payroll_date_types" */
  delete_payroll_date_types: Maybe<Payroll_Date_Types_Mutation_Response>;
  /** delete single row from the table: "payroll_date_types" */
  delete_payroll_date_types_by_pk: Maybe<Payroll_Date_Types>;
  /** delete data from the table: "payroll_dates" */
  delete_payroll_dates: Maybe<Payroll_Dates_Mutation_Response>;
  /** delete single row from the table: "payroll_dates" */
  delete_payroll_dates_by_pk: Maybe<Payroll_Dates>;
  /** delete data from the table: "payroll_version_history_results" */
  delete_payroll_version_history_results: Maybe<Payroll_Version_History_Results_Mutation_Response>;
  /** delete single row from the table: "payroll_version_history_results" */
  delete_payroll_version_history_results_by_pk: Maybe<Payroll_Version_History_Results>;
  /** delete data from the table: "payroll_version_results" */
  delete_payroll_version_results: Maybe<Payroll_Version_Results_Mutation_Response>;
  /** delete single row from the table: "payroll_version_results" */
  delete_payroll_version_results_by_pk: Maybe<Payroll_Version_Results>;
  /** delete data from the table: "payrolls" */
  delete_payrolls: Maybe<Payrolls_Mutation_Response>;
  /** delete single row from the table: "payrolls" */
  delete_payrolls_by_pk: Maybe<Payrolls>;
  /** delete data from the table: "permissions" */
  delete_permissions: Maybe<Permissions_Mutation_Response>;
  /** delete single row from the table: "permissions" */
  delete_permissions_by_pk: Maybe<Permissions>;
  /** delete data from the table: "resources" */
  delete_resources: Maybe<Resources_Mutation_Response>;
  /** delete single row from the table: "resources" */
  delete_resources_by_pk: Maybe<Resources>;
  /** delete data from the table: "role_permissions" */
  delete_role_permissions: Maybe<Role_Permissions_Mutation_Response>;
  /** delete single row from the table: "role_permissions" */
  delete_role_permissions_by_pk: Maybe<Role_Permissions>;
  /** delete data from the table: "roles" */
  delete_roles: Maybe<Roles_Mutation_Response>;
  /** delete single row from the table: "roles" */
  delete_roles_by_pk: Maybe<Roles>;
  /** delete data from the table: "user_roles" */
  delete_user_roles: Maybe<User_Roles_Mutation_Response>;
  /** delete single row from the table: "user_roles" */
  delete_user_roles_by_pk: Maybe<User_Roles>;
  /** delete data from the table: "users" */
  delete_users: Maybe<Users_Mutation_Response>;
  /** delete single row from the table: "users" */
  delete_users_by_pk: Maybe<Users>;
  /** delete data from the table: "users_role_backup" */
  delete_users_role_backup: Maybe<Users_Role_Backup_Mutation_Response>;
  /** delete data from the table: "work_schedule" */
  delete_work_schedule: Maybe<Work_Schedule_Mutation_Response>;
  /** delete single row from the table: "work_schedule" */
  delete_work_schedule_by_pk: Maybe<Work_Schedule>;
  /** insert data into the table: "adjustment_rules" */
  insert_adjustment_rules: Maybe<Adjustment_Rules_Mutation_Response>;
  /** insert a single row into the table: "adjustment_rules" */
  insert_adjustment_rules_one: Maybe<Adjustment_Rules>;
  /** insert data into the table: "app_settings" */
  insert_app_settings: Maybe<App_Settings_Mutation_Response>;
  /** insert a single row into the table: "app_settings" */
  insert_app_settings_one: Maybe<App_Settings>;
  /** insert data into the table: "billing_event_log" */
  insert_billing_event_log: Maybe<Billing_Event_Log_Mutation_Response>;
  /** insert a single row into the table: "billing_event_log" */
  insert_billing_event_log_one: Maybe<Billing_Event_Log>;
  /** insert data into the table: "billing_invoice" */
  insert_billing_invoice: Maybe<Billing_Invoice_Mutation_Response>;
  /** insert data into the table: "billing_invoice_item" */
  insert_billing_invoice_item: Maybe<Billing_Invoice_Item_Mutation_Response>;
  /** insert a single row into the table: "billing_invoice_item" */
  insert_billing_invoice_item_one: Maybe<Billing_Invoice_Item>;
  /** insert a single row into the table: "billing_invoice" */
  insert_billing_invoice_one: Maybe<Billing_Invoice>;
  /** insert data into the table: "billing_invoices" */
  insert_billing_invoices: Maybe<Billing_Invoices_Mutation_Response>;
  /** insert a single row into the table: "billing_invoices" */
  insert_billing_invoices_one: Maybe<Billing_Invoices>;
  /** insert data into the table: "billing_items" */
  insert_billing_items: Maybe<Billing_Items_Mutation_Response>;
  /** insert a single row into the table: "billing_items" */
  insert_billing_items_one: Maybe<Billing_Items>;
  /** insert data into the table: "billing_plan" */
  insert_billing_plan: Maybe<Billing_Plan_Mutation_Response>;
  /** insert a single row into the table: "billing_plan" */
  insert_billing_plan_one: Maybe<Billing_Plan>;
  /** insert data into the table: "client_billing_assignment" */
  insert_client_billing_assignment: Maybe<Client_Billing_Assignment_Mutation_Response>;
  /** insert a single row into the table: "client_billing_assignment" */
  insert_client_billing_assignment_one: Maybe<Client_Billing_Assignment>;
  /** insert data into the table: "client_external_systems" */
  insert_client_external_systems: Maybe<Client_External_Systems_Mutation_Response>;
  /** insert a single row into the table: "client_external_systems" */
  insert_client_external_systems_one: Maybe<Client_External_Systems>;
  /** insert data into the table: "clients" */
  insert_clients: Maybe<Clients_Mutation_Response>;
  /** insert a single row into the table: "clients" */
  insert_clients_one: Maybe<Clients>;
  /** insert data into the table: "external_systems" */
  insert_external_systems: Maybe<External_Systems_Mutation_Response>;
  /** insert a single row into the table: "external_systems" */
  insert_external_systems_one: Maybe<External_Systems>;
  /** insert data into the table: "feature_flags" */
  insert_feature_flags: Maybe<Feature_Flags_Mutation_Response>;
  /** insert a single row into the table: "feature_flags" */
  insert_feature_flags_one: Maybe<Feature_Flags>;
  /** insert data into the table: "holidays" */
  insert_holidays: Maybe<Holidays_Mutation_Response>;
  /** insert a single row into the table: "holidays" */
  insert_holidays_one: Maybe<Holidays>;
  /** insert data into the table: "latest_payroll_version_results" */
  insert_latest_payroll_version_results: Maybe<Latest_Payroll_Version_Results_Mutation_Response>;
  /** insert a single row into the table: "latest_payroll_version_results" */
  insert_latest_payroll_version_results_one: Maybe<Latest_Payroll_Version_Results>;
  /** insert data into the table: "leave" */
  insert_leave: Maybe<Leave_Mutation_Response>;
  /** insert a single row into the table: "leave" */
  insert_leave_one: Maybe<Leave>;
  /** insert data into the table: "neon_auth.users_sync" */
  insert_neon_auth_users_sync: Maybe<Neon_Auth_Users_Sync_Mutation_Response>;
  /** insert a single row into the table: "neon_auth.users_sync" */
  insert_neon_auth_users_sync_one: Maybe<Neon_Auth_Users_Sync>;
  /** insert data into the table: "notes" */
  insert_notes: Maybe<Notes_Mutation_Response>;
  /** insert a single row into the table: "notes" */
  insert_notes_one: Maybe<Notes>;
  /** insert data into the table: "payroll_activation_results" */
  insert_payroll_activation_results: Maybe<Payroll_Activation_Results_Mutation_Response>;
  /** insert a single row into the table: "payroll_activation_results" */
  insert_payroll_activation_results_one: Maybe<Payroll_Activation_Results>;
  /** insert data into the table: "payroll_cycles" */
  insert_payroll_cycles: Maybe<Payroll_Cycles_Mutation_Response>;
  /** insert a single row into the table: "payroll_cycles" */
  insert_payroll_cycles_one: Maybe<Payroll_Cycles>;
  /** insert data into the table: "payroll_date_types" */
  insert_payroll_date_types: Maybe<Payroll_Date_Types_Mutation_Response>;
  /** insert a single row into the table: "payroll_date_types" */
  insert_payroll_date_types_one: Maybe<Payroll_Date_Types>;
  /** insert data into the table: "payroll_dates" */
  insert_payroll_dates: Maybe<Payroll_Dates_Mutation_Response>;
  /** insert a single row into the table: "payroll_dates" */
  insert_payroll_dates_one: Maybe<Payroll_Dates>;
  /** insert data into the table: "payroll_version_history_results" */
  insert_payroll_version_history_results: Maybe<Payroll_Version_History_Results_Mutation_Response>;
  /** insert a single row into the table: "payroll_version_history_results" */
  insert_payroll_version_history_results_one: Maybe<Payroll_Version_History_Results>;
  /** insert data into the table: "payroll_version_results" */
  insert_payroll_version_results: Maybe<Payroll_Version_Results_Mutation_Response>;
  /** insert a single row into the table: "payroll_version_results" */
  insert_payroll_version_results_one: Maybe<Payroll_Version_Results>;
  /** insert data into the table: "payrolls" */
  insert_payrolls: Maybe<Payrolls_Mutation_Response>;
  /** insert a single row into the table: "payrolls" */
  insert_payrolls_one: Maybe<Payrolls>;
  /** insert data into the table: "permissions" */
  insert_permissions: Maybe<Permissions_Mutation_Response>;
  /** insert a single row into the table: "permissions" */
  insert_permissions_one: Maybe<Permissions>;
  /** insert data into the table: "resources" */
  insert_resources: Maybe<Resources_Mutation_Response>;
  /** insert a single row into the table: "resources" */
  insert_resources_one: Maybe<Resources>;
  /** insert data into the table: "role_permissions" */
  insert_role_permissions: Maybe<Role_Permissions_Mutation_Response>;
  /** insert a single row into the table: "role_permissions" */
  insert_role_permissions_one: Maybe<Role_Permissions>;
  /** insert data into the table: "roles" */
  insert_roles: Maybe<Roles_Mutation_Response>;
  /** insert a single row into the table: "roles" */
  insert_roles_one: Maybe<Roles>;
  /** insert data into the table: "user_roles" */
  insert_user_roles: Maybe<User_Roles_Mutation_Response>;
  /** insert a single row into the table: "user_roles" */
  insert_user_roles_one: Maybe<User_Roles>;
  /** insert data into the table: "users" */
  insert_users: Maybe<Users_Mutation_Response>;
  /** insert a single row into the table: "users" */
  insert_users_one: Maybe<Users>;
  /** insert data into the table: "users_role_backup" */
  insert_users_role_backup: Maybe<Users_Role_Backup_Mutation_Response>;
  /** insert a single row into the table: "users_role_backup" */
  insert_users_role_backup_one: Maybe<Users_Role_Backup>;
  /** insert data into the table: "work_schedule" */
  insert_work_schedule: Maybe<Work_Schedule_Mutation_Response>;
  /** insert a single row into the table: "work_schedule" */
  insert_work_schedule_one: Maybe<Work_Schedule>;
  /** update data of the table: "adjustment_rules" */
  update_adjustment_rules: Maybe<Adjustment_Rules_Mutation_Response>;
  /** update single row of the table: "adjustment_rules" */
  update_adjustment_rules_by_pk: Maybe<Adjustment_Rules>;
  /** update multiples rows of table: "adjustment_rules" */
  update_adjustment_rules_many: Maybe<
    Array<Maybe<Adjustment_Rules_Mutation_Response>>
  >;
  /** update data of the table: "app_settings" */
  update_app_settings: Maybe<App_Settings_Mutation_Response>;
  /** update single row of the table: "app_settings" */
  update_app_settings_by_pk: Maybe<App_Settings>;
  /** update multiples rows of table: "app_settings" */
  update_app_settings_many: Maybe<Array<Maybe<App_Settings_Mutation_Response>>>;
  /** update data of the table: "billing_event_log" */
  update_billing_event_log: Maybe<Billing_Event_Log_Mutation_Response>;
  /** update single row of the table: "billing_event_log" */
  update_billing_event_log_by_pk: Maybe<Billing_Event_Log>;
  /** update multiples rows of table: "billing_event_log" */
  update_billing_event_log_many: Maybe<
    Array<Maybe<Billing_Event_Log_Mutation_Response>>
  >;
  /** update data of the table: "billing_invoice" */
  update_billing_invoice: Maybe<Billing_Invoice_Mutation_Response>;
  /** update single row of the table: "billing_invoice" */
  update_billing_invoice_by_pk: Maybe<Billing_Invoice>;
  /** update data of the table: "billing_invoice_item" */
  update_billing_invoice_item: Maybe<Billing_Invoice_Item_Mutation_Response>;
  /** update single row of the table: "billing_invoice_item" */
  update_billing_invoice_item_by_pk: Maybe<Billing_Invoice_Item>;
  /** update multiples rows of table: "billing_invoice_item" */
  update_billing_invoice_item_many: Maybe<
    Array<Maybe<Billing_Invoice_Item_Mutation_Response>>
  >;
  /** update multiples rows of table: "billing_invoice" */
  update_billing_invoice_many: Maybe<
    Array<Maybe<Billing_Invoice_Mutation_Response>>
  >;
  /** update data of the table: "billing_invoices" */
  update_billing_invoices: Maybe<Billing_Invoices_Mutation_Response>;
  /** update single row of the table: "billing_invoices" */
  update_billing_invoices_by_pk: Maybe<Billing_Invoices>;
  /** update multiples rows of table: "billing_invoices" */
  update_billing_invoices_many: Maybe<
    Array<Maybe<Billing_Invoices_Mutation_Response>>
  >;
  /** update data of the table: "billing_items" */
  update_billing_items: Maybe<Billing_Items_Mutation_Response>;
  /** update single row of the table: "billing_items" */
  update_billing_items_by_pk: Maybe<Billing_Items>;
  /** update multiples rows of table: "billing_items" */
  update_billing_items_many: Maybe<
    Array<Maybe<Billing_Items_Mutation_Response>>
  >;
  /** update data of the table: "billing_plan" */
  update_billing_plan: Maybe<Billing_Plan_Mutation_Response>;
  /** update single row of the table: "billing_plan" */
  update_billing_plan_by_pk: Maybe<Billing_Plan>;
  /** update multiples rows of table: "billing_plan" */
  update_billing_plan_many: Maybe<Array<Maybe<Billing_Plan_Mutation_Response>>>;
  /** update data of the table: "client_billing_assignment" */
  update_client_billing_assignment: Maybe<Client_Billing_Assignment_Mutation_Response>;
  /** update single row of the table: "client_billing_assignment" */
  update_client_billing_assignment_by_pk: Maybe<Client_Billing_Assignment>;
  /** update multiples rows of table: "client_billing_assignment" */
  update_client_billing_assignment_many: Maybe<
    Array<Maybe<Client_Billing_Assignment_Mutation_Response>>
  >;
  /** update data of the table: "client_external_systems" */
  update_client_external_systems: Maybe<Client_External_Systems_Mutation_Response>;
  /** update single row of the table: "client_external_systems" */
  update_client_external_systems_by_pk: Maybe<Client_External_Systems>;
  /** update multiples rows of table: "client_external_systems" */
  update_client_external_systems_many: Maybe<
    Array<Maybe<Client_External_Systems_Mutation_Response>>
  >;
  /** update data of the table: "clients" */
  update_clients: Maybe<Clients_Mutation_Response>;
  /** update single row of the table: "clients" */
  update_clients_by_pk: Maybe<Clients>;
  /** update multiples rows of table: "clients" */
  update_clients_many: Maybe<Array<Maybe<Clients_Mutation_Response>>>;
  /** update data of the table: "external_systems" */
  update_external_systems: Maybe<External_Systems_Mutation_Response>;
  /** update single row of the table: "external_systems" */
  update_external_systems_by_pk: Maybe<External_Systems>;
  /** update multiples rows of table: "external_systems" */
  update_external_systems_many: Maybe<
    Array<Maybe<External_Systems_Mutation_Response>>
  >;
  /** update data of the table: "feature_flags" */
  update_feature_flags: Maybe<Feature_Flags_Mutation_Response>;
  /** update single row of the table: "feature_flags" */
  update_feature_flags_by_pk: Maybe<Feature_Flags>;
  /** update multiples rows of table: "feature_flags" */
  update_feature_flags_many: Maybe<
    Array<Maybe<Feature_Flags_Mutation_Response>>
  >;
  /** update data of the table: "holidays" */
  update_holidays: Maybe<Holidays_Mutation_Response>;
  /** update single row of the table: "holidays" */
  update_holidays_by_pk: Maybe<Holidays>;
  /** update multiples rows of table: "holidays" */
  update_holidays_many: Maybe<Array<Maybe<Holidays_Mutation_Response>>>;
  /** update data of the table: "latest_payroll_version_results" */
  update_latest_payroll_version_results: Maybe<Latest_Payroll_Version_Results_Mutation_Response>;
  /** update single row of the table: "latest_payroll_version_results" */
  update_latest_payroll_version_results_by_pk: Maybe<Latest_Payroll_Version_Results>;
  /** update multiples rows of table: "latest_payroll_version_results" */
  update_latest_payroll_version_results_many: Maybe<
    Array<Maybe<Latest_Payroll_Version_Results_Mutation_Response>>
  >;
  /** update data of the table: "leave" */
  update_leave: Maybe<Leave_Mutation_Response>;
  /** update single row of the table: "leave" */
  update_leave_by_pk: Maybe<Leave>;
  /** update multiples rows of table: "leave" */
  update_leave_many: Maybe<Array<Maybe<Leave_Mutation_Response>>>;
  /** update data of the table: "neon_auth.users_sync" */
  update_neon_auth_users_sync: Maybe<Neon_Auth_Users_Sync_Mutation_Response>;
  /** update single row of the table: "neon_auth.users_sync" */
  update_neon_auth_users_sync_by_pk: Maybe<Neon_Auth_Users_Sync>;
  /** update multiples rows of table: "neon_auth.users_sync" */
  update_neon_auth_users_sync_many: Maybe<
    Array<Maybe<Neon_Auth_Users_Sync_Mutation_Response>>
  >;
  /** update data of the table: "notes" */
  update_notes: Maybe<Notes_Mutation_Response>;
  /** update single row of the table: "notes" */
  update_notes_by_pk: Maybe<Notes>;
  /** update multiples rows of table: "notes" */
  update_notes_many: Maybe<Array<Maybe<Notes_Mutation_Response>>>;
  /** update data of the table: "payroll_activation_results" */
  update_payroll_activation_results: Maybe<Payroll_Activation_Results_Mutation_Response>;
  /** update single row of the table: "payroll_activation_results" */
  update_payroll_activation_results_by_pk: Maybe<Payroll_Activation_Results>;
  /** update multiples rows of table: "payroll_activation_results" */
  update_payroll_activation_results_many: Maybe<
    Array<Maybe<Payroll_Activation_Results_Mutation_Response>>
  >;
  /** update data of the table: "payroll_cycles" */
  update_payroll_cycles: Maybe<Payroll_Cycles_Mutation_Response>;
  /** update single row of the table: "payroll_cycles" */
  update_payroll_cycles_by_pk: Maybe<Payroll_Cycles>;
  /** update multiples rows of table: "payroll_cycles" */
  update_payroll_cycles_many: Maybe<
    Array<Maybe<Payroll_Cycles_Mutation_Response>>
  >;
  /** update data of the table: "payroll_date_types" */
  update_payroll_date_types: Maybe<Payroll_Date_Types_Mutation_Response>;
  /** update single row of the table: "payroll_date_types" */
  update_payroll_date_types_by_pk: Maybe<Payroll_Date_Types>;
  /** update multiples rows of table: "payroll_date_types" */
  update_payroll_date_types_many: Maybe<
    Array<Maybe<Payroll_Date_Types_Mutation_Response>>
  >;
  /** update data of the table: "payroll_dates" */
  update_payroll_dates: Maybe<Payroll_Dates_Mutation_Response>;
  /** update single row of the table: "payroll_dates" */
  update_payroll_dates_by_pk: Maybe<Payroll_Dates>;
  /** update multiples rows of table: "payroll_dates" */
  update_payroll_dates_many: Maybe<
    Array<Maybe<Payroll_Dates_Mutation_Response>>
  >;
  /** update data of the table: "payroll_version_history_results" */
  update_payroll_version_history_results: Maybe<Payroll_Version_History_Results_Mutation_Response>;
  /** update single row of the table: "payroll_version_history_results" */
  update_payroll_version_history_results_by_pk: Maybe<Payroll_Version_History_Results>;
  /** update multiples rows of table: "payroll_version_history_results" */
  update_payroll_version_history_results_many: Maybe<
    Array<Maybe<Payroll_Version_History_Results_Mutation_Response>>
  >;
  /** update data of the table: "payroll_version_results" */
  update_payroll_version_results: Maybe<Payroll_Version_Results_Mutation_Response>;
  /** update single row of the table: "payroll_version_results" */
  update_payroll_version_results_by_pk: Maybe<Payroll_Version_Results>;
  /** update multiples rows of table: "payroll_version_results" */
  update_payroll_version_results_many: Maybe<
    Array<Maybe<Payroll_Version_Results_Mutation_Response>>
  >;
  /** update data of the table: "payrolls" */
  update_payrolls: Maybe<Payrolls_Mutation_Response>;
  /** update single row of the table: "payrolls" */
  update_payrolls_by_pk: Maybe<Payrolls>;
  /** update multiples rows of table: "payrolls" */
  update_payrolls_many: Maybe<Array<Maybe<Payrolls_Mutation_Response>>>;
  /** update data of the table: "permissions" */
  update_permissions: Maybe<Permissions_Mutation_Response>;
  /** update single row of the table: "permissions" */
  update_permissions_by_pk: Maybe<Permissions>;
  /** update multiples rows of table: "permissions" */
  update_permissions_many: Maybe<Array<Maybe<Permissions_Mutation_Response>>>;
  /** update data of the table: "resources" */
  update_resources: Maybe<Resources_Mutation_Response>;
  /** update single row of the table: "resources" */
  update_resources_by_pk: Maybe<Resources>;
  /** update multiples rows of table: "resources" */
  update_resources_many: Maybe<Array<Maybe<Resources_Mutation_Response>>>;
  /** update data of the table: "role_permissions" */
  update_role_permissions: Maybe<Role_Permissions_Mutation_Response>;
  /** update single row of the table: "role_permissions" */
  update_role_permissions_by_pk: Maybe<Role_Permissions>;
  /** update multiples rows of table: "role_permissions" */
  update_role_permissions_many: Maybe<
    Array<Maybe<Role_Permissions_Mutation_Response>>
  >;
  /** update data of the table: "roles" */
  update_roles: Maybe<Roles_Mutation_Response>;
  /** update single row of the table: "roles" */
  update_roles_by_pk: Maybe<Roles>;
  /** update multiples rows of table: "roles" */
  update_roles_many: Maybe<Array<Maybe<Roles_Mutation_Response>>>;
  /** update data of the table: "user_roles" */
  update_user_roles: Maybe<User_Roles_Mutation_Response>;
  /** update single row of the table: "user_roles" */
  update_user_roles_by_pk: Maybe<User_Roles>;
  /** update multiples rows of table: "user_roles" */
  update_user_roles_many: Maybe<Array<Maybe<User_Roles_Mutation_Response>>>;
  /** update data of the table: "users" */
  update_users: Maybe<Users_Mutation_Response>;
  /** update single row of the table: "users" */
  update_users_by_pk: Maybe<Users>;
  /** update multiples rows of table: "users" */
  update_users_many: Maybe<Array<Maybe<Users_Mutation_Response>>>;
  /** update data of the table: "users_role_backup" */
  update_users_role_backup: Maybe<Users_Role_Backup_Mutation_Response>;
  /** update multiples rows of table: "users_role_backup" */
  update_users_role_backup_many: Maybe<
    Array<Maybe<Users_Role_Backup_Mutation_Response>>
  >;
  /** update data of the table: "work_schedule" */
  update_work_schedule: Maybe<Work_Schedule_Mutation_Response>;
  /** update single row of the table: "work_schedule" */
  update_work_schedule_by_pk: Maybe<Work_Schedule>;
  /** update multiples rows of table: "work_schedule" */
  update_work_schedule_many: Maybe<
    Array<Maybe<Work_Schedule_Mutation_Response>>
  >;
};

/** mutation root */
export type Mutation_RootCommitPayrollAssignmentsArgs = {
  changes: Array<PayrollAssignmentInput>;
};

/** mutation root */
export type Mutation_RootDelete_Adjustment_RulesArgs = {
  where: Adjustment_Rules_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Adjustment_Rules_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_App_SettingsArgs = {
  where: App_Settings_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_App_Settings_By_PkArgs = {
  id: Scalars["String"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Billing_Event_LogArgs = {
  where: Billing_Event_Log_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Billing_Event_Log_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Billing_InvoiceArgs = {
  where: Billing_Invoice_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Billing_Invoice_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Billing_Invoice_ItemArgs = {
  where: Billing_Invoice_Item_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Billing_Invoice_Item_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Billing_InvoicesArgs = {
  where: Billing_Invoices_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Billing_Invoices_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Billing_ItemsArgs = {
  where: Billing_Items_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Billing_Items_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Billing_PlanArgs = {
  where: Billing_Plan_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Billing_Plan_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Client_Billing_AssignmentArgs = {
  where: Client_Billing_Assignment_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Client_Billing_Assignment_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Client_External_SystemsArgs = {
  where: Client_External_Systems_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Client_External_Systems_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_ClientsArgs = {
  where: Clients_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Clients_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_External_SystemsArgs = {
  where: External_Systems_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_External_Systems_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Feature_FlagsArgs = {
  where: Feature_Flags_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Feature_Flags_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_HolidaysArgs = {
  where: Holidays_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Holidays_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Latest_Payroll_Version_ResultsArgs = {
  where: Latest_Payroll_Version_Results_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Latest_Payroll_Version_Results_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_LeaveArgs = {
  where: Leave_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Leave_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Neon_Auth_Users_SyncArgs = {
  where: Neon_Auth_Users_Sync_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Neon_Auth_Users_Sync_By_PkArgs = {
  id: Scalars["String"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_NotesArgs = {
  where: Notes_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Notes_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Payroll_Activation_ResultsArgs = {
  where: Payroll_Activation_Results_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Payroll_Activation_Results_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Payroll_CyclesArgs = {
  where: Payroll_Cycles_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Payroll_Cycles_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Payroll_Date_TypesArgs = {
  where: Payroll_Date_Types_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Payroll_Date_Types_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Payroll_DatesArgs = {
  where: Payroll_Dates_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Payroll_Dates_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Payroll_Version_History_ResultsArgs = {
  where: Payroll_Version_History_Results_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Payroll_Version_History_Results_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Payroll_Version_ResultsArgs = {
  where: Payroll_Version_Results_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Payroll_Version_Results_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_PayrollsArgs = {
  where: Payrolls_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Payrolls_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_PermissionsArgs = {
  where: Permissions_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Permissions_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_ResourcesArgs = {
  where: Resources_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Resources_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Role_PermissionsArgs = {
  where: Role_Permissions_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Role_Permissions_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_RolesArgs = {
  where: Roles_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Roles_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_User_RolesArgs = {
  where: User_Roles_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_User_Roles_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_UsersArgs = {
  where: Users_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Users_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Users_Role_BackupArgs = {
  where: Users_Role_Backup_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Work_ScheduleArgs = {
  where: Work_Schedule_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Work_Schedule_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootInsert_Adjustment_RulesArgs = {
  objects: Array<Adjustment_Rules_Insert_Input>;
  on_conflict?: InputMaybe<Adjustment_Rules_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Adjustment_Rules_OneArgs = {
  object: Adjustment_Rules_Insert_Input;
  on_conflict?: InputMaybe<Adjustment_Rules_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_App_SettingsArgs = {
  objects: Array<App_Settings_Insert_Input>;
  on_conflict?: InputMaybe<App_Settings_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_App_Settings_OneArgs = {
  object: App_Settings_Insert_Input;
  on_conflict?: InputMaybe<App_Settings_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Billing_Event_LogArgs = {
  objects: Array<Billing_Event_Log_Insert_Input>;
  on_conflict?: InputMaybe<Billing_Event_Log_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Billing_Event_Log_OneArgs = {
  object: Billing_Event_Log_Insert_Input;
  on_conflict?: InputMaybe<Billing_Event_Log_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Billing_InvoiceArgs = {
  objects: Array<Billing_Invoice_Insert_Input>;
  on_conflict?: InputMaybe<Billing_Invoice_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Billing_Invoice_ItemArgs = {
  objects: Array<Billing_Invoice_Item_Insert_Input>;
  on_conflict?: InputMaybe<Billing_Invoice_Item_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Billing_Invoice_Item_OneArgs = {
  object: Billing_Invoice_Item_Insert_Input;
  on_conflict?: InputMaybe<Billing_Invoice_Item_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Billing_Invoice_OneArgs = {
  object: Billing_Invoice_Insert_Input;
  on_conflict?: InputMaybe<Billing_Invoice_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Billing_InvoicesArgs = {
  objects: Array<Billing_Invoices_Insert_Input>;
  on_conflict?: InputMaybe<Billing_Invoices_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Billing_Invoices_OneArgs = {
  object: Billing_Invoices_Insert_Input;
  on_conflict?: InputMaybe<Billing_Invoices_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Billing_ItemsArgs = {
  objects: Array<Billing_Items_Insert_Input>;
  on_conflict?: InputMaybe<Billing_Items_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Billing_Items_OneArgs = {
  object: Billing_Items_Insert_Input;
  on_conflict?: InputMaybe<Billing_Items_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Billing_PlanArgs = {
  objects: Array<Billing_Plan_Insert_Input>;
  on_conflict?: InputMaybe<Billing_Plan_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Billing_Plan_OneArgs = {
  object: Billing_Plan_Insert_Input;
  on_conflict?: InputMaybe<Billing_Plan_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Client_Billing_AssignmentArgs = {
  objects: Array<Client_Billing_Assignment_Insert_Input>;
  on_conflict?: InputMaybe<Client_Billing_Assignment_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Client_Billing_Assignment_OneArgs = {
  object: Client_Billing_Assignment_Insert_Input;
  on_conflict?: InputMaybe<Client_Billing_Assignment_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Client_External_SystemsArgs = {
  objects: Array<Client_External_Systems_Insert_Input>;
  on_conflict?: InputMaybe<Client_External_Systems_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Client_External_Systems_OneArgs = {
  object: Client_External_Systems_Insert_Input;
  on_conflict?: InputMaybe<Client_External_Systems_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_ClientsArgs = {
  objects: Array<Clients_Insert_Input>;
  on_conflict?: InputMaybe<Clients_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Clients_OneArgs = {
  object: Clients_Insert_Input;
  on_conflict?: InputMaybe<Clients_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_External_SystemsArgs = {
  objects: Array<External_Systems_Insert_Input>;
  on_conflict?: InputMaybe<External_Systems_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_External_Systems_OneArgs = {
  object: External_Systems_Insert_Input;
  on_conflict?: InputMaybe<External_Systems_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Feature_FlagsArgs = {
  objects: Array<Feature_Flags_Insert_Input>;
  on_conflict?: InputMaybe<Feature_Flags_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Feature_Flags_OneArgs = {
  object: Feature_Flags_Insert_Input;
  on_conflict?: InputMaybe<Feature_Flags_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_HolidaysArgs = {
  objects: Array<Holidays_Insert_Input>;
  on_conflict?: InputMaybe<Holidays_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Holidays_OneArgs = {
  object: Holidays_Insert_Input;
  on_conflict?: InputMaybe<Holidays_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Latest_Payroll_Version_ResultsArgs = {
  objects: Array<Latest_Payroll_Version_Results_Insert_Input>;
  on_conflict?: InputMaybe<Latest_Payroll_Version_Results_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Latest_Payroll_Version_Results_OneArgs = {
  object: Latest_Payroll_Version_Results_Insert_Input;
  on_conflict?: InputMaybe<Latest_Payroll_Version_Results_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_LeaveArgs = {
  objects: Array<Leave_Insert_Input>;
  on_conflict?: InputMaybe<Leave_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Leave_OneArgs = {
  object: Leave_Insert_Input;
  on_conflict?: InputMaybe<Leave_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Neon_Auth_Users_SyncArgs = {
  objects: Array<Neon_Auth_Users_Sync_Insert_Input>;
  on_conflict?: InputMaybe<Neon_Auth_Users_Sync_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Neon_Auth_Users_Sync_OneArgs = {
  object: Neon_Auth_Users_Sync_Insert_Input;
  on_conflict?: InputMaybe<Neon_Auth_Users_Sync_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_NotesArgs = {
  objects: Array<Notes_Insert_Input>;
  on_conflict?: InputMaybe<Notes_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Notes_OneArgs = {
  object: Notes_Insert_Input;
  on_conflict?: InputMaybe<Notes_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Payroll_Activation_ResultsArgs = {
  objects: Array<Payroll_Activation_Results_Insert_Input>;
  on_conflict?: InputMaybe<Payroll_Activation_Results_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Payroll_Activation_Results_OneArgs = {
  object: Payroll_Activation_Results_Insert_Input;
  on_conflict?: InputMaybe<Payroll_Activation_Results_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Payroll_CyclesArgs = {
  objects: Array<Payroll_Cycles_Insert_Input>;
  on_conflict?: InputMaybe<Payroll_Cycles_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Payroll_Cycles_OneArgs = {
  object: Payroll_Cycles_Insert_Input;
  on_conflict?: InputMaybe<Payroll_Cycles_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Payroll_Date_TypesArgs = {
  objects: Array<Payroll_Date_Types_Insert_Input>;
  on_conflict?: InputMaybe<Payroll_Date_Types_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Payroll_Date_Types_OneArgs = {
  object: Payroll_Date_Types_Insert_Input;
  on_conflict?: InputMaybe<Payroll_Date_Types_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Payroll_DatesArgs = {
  objects: Array<Payroll_Dates_Insert_Input>;
  on_conflict?: InputMaybe<Payroll_Dates_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Payroll_Dates_OneArgs = {
  object: Payroll_Dates_Insert_Input;
  on_conflict?: InputMaybe<Payroll_Dates_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Payroll_Version_History_ResultsArgs = {
  objects: Array<Payroll_Version_History_Results_Insert_Input>;
  on_conflict?: InputMaybe<Payroll_Version_History_Results_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Payroll_Version_History_Results_OneArgs = {
  object: Payroll_Version_History_Results_Insert_Input;
  on_conflict?: InputMaybe<Payroll_Version_History_Results_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Payroll_Version_ResultsArgs = {
  objects: Array<Payroll_Version_Results_Insert_Input>;
  on_conflict?: InputMaybe<Payroll_Version_Results_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Payroll_Version_Results_OneArgs = {
  object: Payroll_Version_Results_Insert_Input;
  on_conflict?: InputMaybe<Payroll_Version_Results_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_PayrollsArgs = {
  objects: Array<Payrolls_Insert_Input>;
  on_conflict?: InputMaybe<Payrolls_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Payrolls_OneArgs = {
  object: Payrolls_Insert_Input;
  on_conflict?: InputMaybe<Payrolls_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_PermissionsArgs = {
  objects: Array<Permissions_Insert_Input>;
  on_conflict?: InputMaybe<Permissions_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Permissions_OneArgs = {
  object: Permissions_Insert_Input;
  on_conflict?: InputMaybe<Permissions_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_ResourcesArgs = {
  objects: Array<Resources_Insert_Input>;
  on_conflict?: InputMaybe<Resources_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Resources_OneArgs = {
  object: Resources_Insert_Input;
  on_conflict?: InputMaybe<Resources_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Role_PermissionsArgs = {
  objects: Array<Role_Permissions_Insert_Input>;
  on_conflict?: InputMaybe<Role_Permissions_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Role_Permissions_OneArgs = {
  object: Role_Permissions_Insert_Input;
  on_conflict?: InputMaybe<Role_Permissions_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_RolesArgs = {
  objects: Array<Roles_Insert_Input>;
  on_conflict?: InputMaybe<Roles_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Roles_OneArgs = {
  object: Roles_Insert_Input;
  on_conflict?: InputMaybe<Roles_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_User_RolesArgs = {
  objects: Array<User_Roles_Insert_Input>;
  on_conflict?: InputMaybe<User_Roles_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_User_Roles_OneArgs = {
  object: User_Roles_Insert_Input;
  on_conflict?: InputMaybe<User_Roles_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_UsersArgs = {
  objects: Array<Users_Insert_Input>;
  on_conflict?: InputMaybe<Users_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Users_OneArgs = {
  object: Users_Insert_Input;
  on_conflict?: InputMaybe<Users_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Users_Role_BackupArgs = {
  objects: Array<Users_Role_Backup_Insert_Input>;
};

/** mutation root */
export type Mutation_RootInsert_Users_Role_Backup_OneArgs = {
  object: Users_Role_Backup_Insert_Input;
};

/** mutation root */
export type Mutation_RootInsert_Work_ScheduleArgs = {
  objects: Array<Work_Schedule_Insert_Input>;
  on_conflict?: InputMaybe<Work_Schedule_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Work_Schedule_OneArgs = {
  object: Work_Schedule_Insert_Input;
  on_conflict?: InputMaybe<Work_Schedule_On_Conflict>;
};

/** mutation root */
export type Mutation_RootUpdate_Adjustment_RulesArgs = {
  _set?: InputMaybe<Adjustment_Rules_Set_Input>;
  where: Adjustment_Rules_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Adjustment_Rules_By_PkArgs = {
  _set?: InputMaybe<Adjustment_Rules_Set_Input>;
  pk_columns: Adjustment_Rules_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Adjustment_Rules_ManyArgs = {
  updates: Array<Adjustment_Rules_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_App_SettingsArgs = {
  _append?: InputMaybe<App_Settings_Append_Input>;
  _delete_at_path?: InputMaybe<App_Settings_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<App_Settings_Delete_Elem_Input>;
  _delete_key?: InputMaybe<App_Settings_Delete_Key_Input>;
  _prepend?: InputMaybe<App_Settings_Prepend_Input>;
  _set?: InputMaybe<App_Settings_Set_Input>;
  where: App_Settings_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_App_Settings_By_PkArgs = {
  _append?: InputMaybe<App_Settings_Append_Input>;
  _delete_at_path?: InputMaybe<App_Settings_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<App_Settings_Delete_Elem_Input>;
  _delete_key?: InputMaybe<App_Settings_Delete_Key_Input>;
  _prepend?: InputMaybe<App_Settings_Prepend_Input>;
  _set?: InputMaybe<App_Settings_Set_Input>;
  pk_columns: App_Settings_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_App_Settings_ManyArgs = {
  updates: Array<App_Settings_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Billing_Event_LogArgs = {
  _set?: InputMaybe<Billing_Event_Log_Set_Input>;
  where: Billing_Event_Log_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Billing_Event_Log_By_PkArgs = {
  _set?: InputMaybe<Billing_Event_Log_Set_Input>;
  pk_columns: Billing_Event_Log_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Billing_Event_Log_ManyArgs = {
  updates: Array<Billing_Event_Log_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Billing_InvoiceArgs = {
  _inc?: InputMaybe<Billing_Invoice_Inc_Input>;
  _set?: InputMaybe<Billing_Invoice_Set_Input>;
  where: Billing_Invoice_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Billing_Invoice_By_PkArgs = {
  _inc?: InputMaybe<Billing_Invoice_Inc_Input>;
  _set?: InputMaybe<Billing_Invoice_Set_Input>;
  pk_columns: Billing_Invoice_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Billing_Invoice_ItemArgs = {
  _inc?: InputMaybe<Billing_Invoice_Item_Inc_Input>;
  _set?: InputMaybe<Billing_Invoice_Item_Set_Input>;
  where: Billing_Invoice_Item_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Billing_Invoice_Item_By_PkArgs = {
  _inc?: InputMaybe<Billing_Invoice_Item_Inc_Input>;
  _set?: InputMaybe<Billing_Invoice_Item_Set_Input>;
  pk_columns: Billing_Invoice_Item_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Billing_Invoice_Item_ManyArgs = {
  updates: Array<Billing_Invoice_Item_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Billing_Invoice_ManyArgs = {
  updates: Array<Billing_Invoice_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Billing_InvoicesArgs = {
  _inc?: InputMaybe<Billing_Invoices_Inc_Input>;
  _set?: InputMaybe<Billing_Invoices_Set_Input>;
  where: Billing_Invoices_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Billing_Invoices_By_PkArgs = {
  _inc?: InputMaybe<Billing_Invoices_Inc_Input>;
  _set?: InputMaybe<Billing_Invoices_Set_Input>;
  pk_columns: Billing_Invoices_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Billing_Invoices_ManyArgs = {
  updates: Array<Billing_Invoices_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Billing_ItemsArgs = {
  _inc?: InputMaybe<Billing_Items_Inc_Input>;
  _set?: InputMaybe<Billing_Items_Set_Input>;
  where: Billing_Items_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Billing_Items_By_PkArgs = {
  _inc?: InputMaybe<Billing_Items_Inc_Input>;
  _set?: InputMaybe<Billing_Items_Set_Input>;
  pk_columns: Billing_Items_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Billing_Items_ManyArgs = {
  updates: Array<Billing_Items_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Billing_PlanArgs = {
  _inc?: InputMaybe<Billing_Plan_Inc_Input>;
  _set?: InputMaybe<Billing_Plan_Set_Input>;
  where: Billing_Plan_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Billing_Plan_By_PkArgs = {
  _inc?: InputMaybe<Billing_Plan_Inc_Input>;
  _set?: InputMaybe<Billing_Plan_Set_Input>;
  pk_columns: Billing_Plan_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Billing_Plan_ManyArgs = {
  updates: Array<Billing_Plan_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Client_Billing_AssignmentArgs = {
  _set?: InputMaybe<Client_Billing_Assignment_Set_Input>;
  where: Client_Billing_Assignment_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Client_Billing_Assignment_By_PkArgs = {
  _set?: InputMaybe<Client_Billing_Assignment_Set_Input>;
  pk_columns: Client_Billing_Assignment_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Client_Billing_Assignment_ManyArgs = {
  updates: Array<Client_Billing_Assignment_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Client_External_SystemsArgs = {
  _set?: InputMaybe<Client_External_Systems_Set_Input>;
  where: Client_External_Systems_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Client_External_Systems_By_PkArgs = {
  _set?: InputMaybe<Client_External_Systems_Set_Input>;
  pk_columns: Client_External_Systems_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Client_External_Systems_ManyArgs = {
  updates: Array<Client_External_Systems_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_ClientsArgs = {
  _set?: InputMaybe<Clients_Set_Input>;
  where: Clients_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Clients_By_PkArgs = {
  _set?: InputMaybe<Clients_Set_Input>;
  pk_columns: Clients_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Clients_ManyArgs = {
  updates: Array<Clients_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_External_SystemsArgs = {
  _set?: InputMaybe<External_Systems_Set_Input>;
  where: External_Systems_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_External_Systems_By_PkArgs = {
  _set?: InputMaybe<External_Systems_Set_Input>;
  pk_columns: External_Systems_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_External_Systems_ManyArgs = {
  updates: Array<External_Systems_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Feature_FlagsArgs = {
  _append?: InputMaybe<Feature_Flags_Append_Input>;
  _delete_at_path?: InputMaybe<Feature_Flags_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Feature_Flags_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Feature_Flags_Delete_Key_Input>;
  _prepend?: InputMaybe<Feature_Flags_Prepend_Input>;
  _set?: InputMaybe<Feature_Flags_Set_Input>;
  where: Feature_Flags_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Feature_Flags_By_PkArgs = {
  _append?: InputMaybe<Feature_Flags_Append_Input>;
  _delete_at_path?: InputMaybe<Feature_Flags_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Feature_Flags_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Feature_Flags_Delete_Key_Input>;
  _prepend?: InputMaybe<Feature_Flags_Prepend_Input>;
  _set?: InputMaybe<Feature_Flags_Set_Input>;
  pk_columns: Feature_Flags_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Feature_Flags_ManyArgs = {
  updates: Array<Feature_Flags_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_HolidaysArgs = {
  _inc?: InputMaybe<Holidays_Inc_Input>;
  _set?: InputMaybe<Holidays_Set_Input>;
  where: Holidays_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Holidays_By_PkArgs = {
  _inc?: InputMaybe<Holidays_Inc_Input>;
  _set?: InputMaybe<Holidays_Set_Input>;
  pk_columns: Holidays_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Holidays_ManyArgs = {
  updates: Array<Holidays_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Latest_Payroll_Version_ResultsArgs = {
  _inc?: InputMaybe<Latest_Payroll_Version_Results_Inc_Input>;
  _set?: InputMaybe<Latest_Payroll_Version_Results_Set_Input>;
  where: Latest_Payroll_Version_Results_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Latest_Payroll_Version_Results_By_PkArgs = {
  _inc?: InputMaybe<Latest_Payroll_Version_Results_Inc_Input>;
  _set?: InputMaybe<Latest_Payroll_Version_Results_Set_Input>;
  pk_columns: Latest_Payroll_Version_Results_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Latest_Payroll_Version_Results_ManyArgs = {
  updates: Array<Latest_Payroll_Version_Results_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_LeaveArgs = {
  _set?: InputMaybe<Leave_Set_Input>;
  where: Leave_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Leave_By_PkArgs = {
  _set?: InputMaybe<Leave_Set_Input>;
  pk_columns: Leave_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Leave_ManyArgs = {
  updates: Array<Leave_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Neon_Auth_Users_SyncArgs = {
  _append?: InputMaybe<Neon_Auth_Users_Sync_Append_Input>;
  _delete_at_path?: InputMaybe<Neon_Auth_Users_Sync_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Neon_Auth_Users_Sync_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Neon_Auth_Users_Sync_Delete_Key_Input>;
  _prepend?: InputMaybe<Neon_Auth_Users_Sync_Prepend_Input>;
  _set?: InputMaybe<Neon_Auth_Users_Sync_Set_Input>;
  where: Neon_Auth_Users_Sync_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Neon_Auth_Users_Sync_By_PkArgs = {
  _append?: InputMaybe<Neon_Auth_Users_Sync_Append_Input>;
  _delete_at_path?: InputMaybe<Neon_Auth_Users_Sync_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Neon_Auth_Users_Sync_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Neon_Auth_Users_Sync_Delete_Key_Input>;
  _prepend?: InputMaybe<Neon_Auth_Users_Sync_Prepend_Input>;
  _set?: InputMaybe<Neon_Auth_Users_Sync_Set_Input>;
  pk_columns: Neon_Auth_Users_Sync_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Neon_Auth_Users_Sync_ManyArgs = {
  updates: Array<Neon_Auth_Users_Sync_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_NotesArgs = {
  _set?: InputMaybe<Notes_Set_Input>;
  where: Notes_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Notes_By_PkArgs = {
  _set?: InputMaybe<Notes_Set_Input>;
  pk_columns: Notes_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Notes_ManyArgs = {
  updates: Array<Notes_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Payroll_Activation_ResultsArgs = {
  _inc?: InputMaybe<Payroll_Activation_Results_Inc_Input>;
  _set?: InputMaybe<Payroll_Activation_Results_Set_Input>;
  where: Payroll_Activation_Results_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Payroll_Activation_Results_By_PkArgs = {
  _inc?: InputMaybe<Payroll_Activation_Results_Inc_Input>;
  _set?: InputMaybe<Payroll_Activation_Results_Set_Input>;
  pk_columns: Payroll_Activation_Results_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Payroll_Activation_Results_ManyArgs = {
  updates: Array<Payroll_Activation_Results_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Payroll_CyclesArgs = {
  _set?: InputMaybe<Payroll_Cycles_Set_Input>;
  where: Payroll_Cycles_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Payroll_Cycles_By_PkArgs = {
  _set?: InputMaybe<Payroll_Cycles_Set_Input>;
  pk_columns: Payroll_Cycles_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Payroll_Cycles_ManyArgs = {
  updates: Array<Payroll_Cycles_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Payroll_Date_TypesArgs = {
  _set?: InputMaybe<Payroll_Date_Types_Set_Input>;
  where: Payroll_Date_Types_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Payroll_Date_Types_By_PkArgs = {
  _set?: InputMaybe<Payroll_Date_Types_Set_Input>;
  pk_columns: Payroll_Date_Types_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Payroll_Date_Types_ManyArgs = {
  updates: Array<Payroll_Date_Types_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Payroll_DatesArgs = {
  _set?: InputMaybe<Payroll_Dates_Set_Input>;
  where: Payroll_Dates_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Payroll_Dates_By_PkArgs = {
  _set?: InputMaybe<Payroll_Dates_Set_Input>;
  pk_columns: Payroll_Dates_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Payroll_Dates_ManyArgs = {
  updates: Array<Payroll_Dates_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Payroll_Version_History_ResultsArgs = {
  _inc?: InputMaybe<Payroll_Version_History_Results_Inc_Input>;
  _set?: InputMaybe<Payroll_Version_History_Results_Set_Input>;
  where: Payroll_Version_History_Results_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Payroll_Version_History_Results_By_PkArgs = {
  _inc?: InputMaybe<Payroll_Version_History_Results_Inc_Input>;
  _set?: InputMaybe<Payroll_Version_History_Results_Set_Input>;
  pk_columns: Payroll_Version_History_Results_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Payroll_Version_History_Results_ManyArgs = {
  updates: Array<Payroll_Version_History_Results_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Payroll_Version_ResultsArgs = {
  _inc?: InputMaybe<Payroll_Version_Results_Inc_Input>;
  _set?: InputMaybe<Payroll_Version_Results_Set_Input>;
  where: Payroll_Version_Results_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Payroll_Version_Results_By_PkArgs = {
  _inc?: InputMaybe<Payroll_Version_Results_Inc_Input>;
  _set?: InputMaybe<Payroll_Version_Results_Set_Input>;
  pk_columns: Payroll_Version_Results_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Payroll_Version_Results_ManyArgs = {
  updates: Array<Payroll_Version_Results_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_PayrollsArgs = {
  _inc?: InputMaybe<Payrolls_Inc_Input>;
  _set?: InputMaybe<Payrolls_Set_Input>;
  where: Payrolls_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Payrolls_By_PkArgs = {
  _inc?: InputMaybe<Payrolls_Inc_Input>;
  _set?: InputMaybe<Payrolls_Set_Input>;
  pk_columns: Payrolls_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Payrolls_ManyArgs = {
  updates: Array<Payrolls_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_PermissionsArgs = {
  _set?: InputMaybe<Permissions_Set_Input>;
  where: Permissions_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Permissions_By_PkArgs = {
  _set?: InputMaybe<Permissions_Set_Input>;
  pk_columns: Permissions_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Permissions_ManyArgs = {
  updates: Array<Permissions_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_ResourcesArgs = {
  _set?: InputMaybe<Resources_Set_Input>;
  where: Resources_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Resources_By_PkArgs = {
  _set?: InputMaybe<Resources_Set_Input>;
  pk_columns: Resources_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Resources_ManyArgs = {
  updates: Array<Resources_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Role_PermissionsArgs = {
  _append?: InputMaybe<Role_Permissions_Append_Input>;
  _delete_at_path?: InputMaybe<Role_Permissions_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Role_Permissions_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Role_Permissions_Delete_Key_Input>;
  _prepend?: InputMaybe<Role_Permissions_Prepend_Input>;
  _set?: InputMaybe<Role_Permissions_Set_Input>;
  where: Role_Permissions_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Role_Permissions_By_PkArgs = {
  _append?: InputMaybe<Role_Permissions_Append_Input>;
  _delete_at_path?: InputMaybe<Role_Permissions_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Role_Permissions_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Role_Permissions_Delete_Key_Input>;
  _prepend?: InputMaybe<Role_Permissions_Prepend_Input>;
  _set?: InputMaybe<Role_Permissions_Set_Input>;
  pk_columns: Role_Permissions_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Role_Permissions_ManyArgs = {
  updates: Array<Role_Permissions_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_RolesArgs = {
  _inc?: InputMaybe<Roles_Inc_Input>;
  _set?: InputMaybe<Roles_Set_Input>;
  where: Roles_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Roles_By_PkArgs = {
  _inc?: InputMaybe<Roles_Inc_Input>;
  _set?: InputMaybe<Roles_Set_Input>;
  pk_columns: Roles_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Roles_ManyArgs = {
  updates: Array<Roles_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_User_RolesArgs = {
  _set?: InputMaybe<User_Roles_Set_Input>;
  where: User_Roles_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_User_Roles_By_PkArgs = {
  _set?: InputMaybe<User_Roles_Set_Input>;
  pk_columns: User_Roles_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_User_Roles_ManyArgs = {
  updates: Array<User_Roles_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_UsersArgs = {
  _set?: InputMaybe<Users_Set_Input>;
  where: Users_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Users_By_PkArgs = {
  _set?: InputMaybe<Users_Set_Input>;
  pk_columns: Users_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Users_ManyArgs = {
  updates: Array<Users_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Users_Role_BackupArgs = {
  _set?: InputMaybe<Users_Role_Backup_Set_Input>;
  where: Users_Role_Backup_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Users_Role_Backup_ManyArgs = {
  updates: Array<Users_Role_Backup_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Work_ScheduleArgs = {
  _inc?: InputMaybe<Work_Schedule_Inc_Input>;
  _set?: InputMaybe<Work_Schedule_Set_Input>;
  where: Work_Schedule_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Work_Schedule_By_PkArgs = {
  _inc?: InputMaybe<Work_Schedule_Inc_Input>;
  _set?: InputMaybe<Work_Schedule_Set_Input>;
  pk_columns: Work_Schedule_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Work_Schedule_ManyArgs = {
  updates: Array<Work_Schedule_Updates>;
};

/** columns and relationships of "neon_auth.users_sync" */
export type Neon_Auth_Users_Sync = {
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
export type Neon_Auth_Users_SyncRaw_JsonArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregated selection of "neon_auth.users_sync" */
export type Neon_Auth_Users_Sync_Aggregate = {
  __typename: "neon_auth_users_sync_aggregate";
  aggregate: Maybe<Neon_Auth_Users_Sync_Aggregate_Fields>;
  nodes: Array<Neon_Auth_Users_Sync>;
};

/** aggregate fields of "neon_auth.users_sync" */
export type Neon_Auth_Users_Sync_Aggregate_Fields = {
  __typename: "neon_auth_users_sync_aggregate_fields";
  count: Scalars["Int"]["output"];
  max: Maybe<Neon_Auth_Users_Sync_Max_Fields>;
  min: Maybe<Neon_Auth_Users_Sync_Min_Fields>;
};

/** aggregate fields of "neon_auth.users_sync" */
export type Neon_Auth_Users_Sync_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Neon_Auth_Users_Sync_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Neon_Auth_Users_Sync_Append_Input = {
  /** Complete JSON data from the authentication provider */
  raw_json?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** Boolean expression to filter rows from the table "neon_auth.users_sync". All fields are combined with a logical 'AND'. */
export type Neon_Auth_Users_Sync_Bool_Exp = {
  _and?: InputMaybe<Array<Neon_Auth_Users_Sync_Bool_Exp>>;
  _not?: InputMaybe<Neon_Auth_Users_Sync_Bool_Exp>;
  _or?: InputMaybe<Array<Neon_Auth_Users_Sync_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  deleted_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  email?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  raw_json?: InputMaybe<Jsonb_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "neon_auth.users_sync" */
export type Neon_Auth_Users_Sync_Constraint =
  /** unique or primary key constraint on columns "id" */
  "users_sync_pkey";

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Neon_Auth_Users_Sync_Delete_At_Path_Input = {
  /** Complete JSON data from the authentication provider */
  raw_json?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Neon_Auth_Users_Sync_Delete_Elem_Input = {
  /** Complete JSON data from the authentication provider */
  raw_json?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Neon_Auth_Users_Sync_Delete_Key_Input = {
  /** Complete JSON data from the authentication provider */
  raw_json?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for inserting data into table "neon_auth.users_sync" */
export type Neon_Auth_Users_Sync_Insert_Input = {
  /** Timestamp when the user was deleted in the auth system */
  deleted_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  /** Complete JSON data from the authentication provider */
  raw_json?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Timestamp when the user was last updated in the auth system */
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** aggregate max on columns */
export type Neon_Auth_Users_Sync_Max_Fields = {
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
export type Neon_Auth_Users_Sync_Min_Fields = {
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
export type Neon_Auth_Users_Sync_Mutation_Response = {
  __typename: "neon_auth_users_sync_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Neon_Auth_Users_Sync>;
};

/** on_conflict condition type for table "neon_auth.users_sync" */
export type Neon_Auth_Users_Sync_On_Conflict = {
  constraint: Neon_Auth_Users_Sync_Constraint;
  update_columns?: Array<Neon_Auth_Users_Sync_Update_Column>;
  where?: InputMaybe<Neon_Auth_Users_Sync_Bool_Exp>;
};

/** Ordering options when selecting data from "neon_auth.users_sync". */
export type Neon_Auth_Users_Sync_Order_By = {
  created_at?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  raw_json?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: neon_auth.users_sync */
export type Neon_Auth_Users_Sync_Pk_Columns_Input = {
  /** Unique identifier from the authentication provider */
  id: Scalars["String"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Neon_Auth_Users_Sync_Prepend_Input = {
  /** Complete JSON data from the authentication provider */
  raw_json?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "neon_auth.users_sync" */
export type Neon_Auth_Users_Sync_Select_Column =
  /** column name */
  | "created_at"
  /** column name */
  | "deleted_at"
  /** column name */
  | "email"
  /** column name */
  | "id"
  /** column name */
  | "name"
  /** column name */
  | "raw_json"
  /** column name */
  | "updated_at";

/** input type for updating data in table "neon_auth.users_sync" */
export type Neon_Auth_Users_Sync_Set_Input = {
  /** Timestamp when the user was deleted in the auth system */
  deleted_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  /** Complete JSON data from the authentication provider */
  raw_json?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Timestamp when the user was last updated in the auth system */
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** Streaming cursor of the table "neon_auth_users_sync" */
export type Neon_Auth_Users_Sync_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Neon_Auth_Users_Sync_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Neon_Auth_Users_Sync_Stream_Cursor_Value_Input = {
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
export type Neon_Auth_Users_Sync_Update_Column =
  /** column name */
  | "deleted_at"
  /** column name */
  | "raw_json"
  /** column name */
  | "updated_at";

export type Neon_Auth_Users_Sync_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Neon_Auth_Users_Sync_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Neon_Auth_Users_Sync_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Neon_Auth_Users_Sync_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Neon_Auth_Users_Sync_Delete_Key_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Neon_Auth_Users_Sync_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Neon_Auth_Users_Sync_Set_Input>;
  /** filter the rows which have to be updated */
  where: Neon_Auth_Users_Sync_Bool_Exp;
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
  notes_by_client_aggregate: Clients_Aggregate;
  /** An array relationship */
  notes_by_payroll: Array<Payrolls>;
  /** An aggregate relationship */
  notes_by_payroll_aggregate: Payrolls_Aggregate;
  /** Timestamp when the note was last updated */
  updated_at: Maybe<Scalars["timestamp"]["output"]>;
  /** An object relationship */
  user: Maybe<Users>;
  /** User who created the note */
  user_id: Maybe<Scalars["uuid"]["output"]>;
};

/** columns and relationships of "notes" */
export type NotesNotes_By_ClientArgs = {
  distinct_on?: InputMaybe<Array<Clients_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Clients_Order_By>>;
  where?: InputMaybe<Clients_Bool_Exp>;
};

/** columns and relationships of "notes" */
export type NotesNotes_By_Client_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Clients_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Clients_Order_By>>;
  where?: InputMaybe<Clients_Bool_Exp>;
};

/** columns and relationships of "notes" */
export type NotesNotes_By_PayrollArgs = {
  distinct_on?: InputMaybe<Array<Payrolls_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payrolls_Order_By>>;
  where?: InputMaybe<Payrolls_Bool_Exp>;
};

/** columns and relationships of "notes" */
export type NotesNotes_By_Payroll_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payrolls_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payrolls_Order_By>>;
  where?: InputMaybe<Payrolls_Bool_Exp>;
};

/** aggregated selection of "notes" */
export type Notes_Aggregate = {
  __typename: "notes_aggregate";
  aggregate: Maybe<Notes_Aggregate_Fields>;
  nodes: Array<Notes>;
};

export type Notes_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Notes_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Notes_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Notes_Aggregate_Bool_Exp_Count>;
};

export type Notes_Aggregate_Bool_Exp_Bool_And = {
  arguments: Notes_Select_Column_Notes_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Notes_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Notes_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Notes_Select_Column_Notes_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Notes_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Notes_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Notes_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Notes_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "notes" */
export type Notes_Aggregate_Fields = {
  __typename: "notes_aggregate_fields";
  count: Scalars["Int"]["output"];
  max: Maybe<Notes_Max_Fields>;
  min: Maybe<Notes_Min_Fields>;
};

/** aggregate fields of "notes" */
export type Notes_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Notes_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "notes" */
export type Notes_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Notes_Max_Order_By>;
  min?: InputMaybe<Notes_Min_Order_By>;
};

/** input type for inserting array relation for remote table "notes" */
export type Notes_Arr_Rel_Insert_Input = {
  data: Array<Notes_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Notes_On_Conflict>;
};

/** Boolean expression to filter rows from the table "notes". All fields are combined with a logical 'AND'. */
export type Notes_Bool_Exp = {
  _and?: InputMaybe<Array<Notes_Bool_Exp>>;
  _not?: InputMaybe<Notes_Bool_Exp>;
  _or?: InputMaybe<Array<Notes_Bool_Exp>>;
  content?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  entity_id?: InputMaybe<Uuid_Comparison_Exp>;
  entity_type?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  is_important?: InputMaybe<Boolean_Comparison_Exp>;
  notes_by_client?: InputMaybe<Clients_Bool_Exp>;
  notes_by_client_aggregate?: InputMaybe<Clients_Aggregate_Bool_Exp>;
  notes_by_payroll?: InputMaybe<Payrolls_Bool_Exp>;
  notes_by_payroll_aggregate?: InputMaybe<Payrolls_Aggregate_Bool_Exp>;
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "notes" */
export type Notes_Constraint =
  /** unique or primary key constraint on columns "id" */
  "notes_pkey";

/** input type for inserting data into table "notes" */
export type Notes_Insert_Input = {
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
  notes_by_client?: InputMaybe<Clients_Arr_Rel_Insert_Input>;
  notes_by_payroll?: InputMaybe<Payrolls_Arr_Rel_Insert_Input>;
  /** Timestamp when the note was last updated */
  updated_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  /** User who created the note */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Notes_Max_Fields = {
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
export type Notes_Max_Order_By = {
  /** Content of the note */
  content?: InputMaybe<Order_By>;
  /** Timestamp when the note was created */
  created_at?: InputMaybe<Order_By>;
  /** Identifier of the entity this note is attached to */
  entity_id?: InputMaybe<Order_By>;
  /** Type of entity this note is attached to (client, payroll, etc.) */
  entity_type?: InputMaybe<Order_By>;
  /** Unique identifier for the note */
  id?: InputMaybe<Order_By>;
  /** Timestamp when the note was last updated */
  updated_at?: InputMaybe<Order_By>;
  /** User who created the note */
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Notes_Min_Fields = {
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
export type Notes_Min_Order_By = {
  /** Content of the note */
  content?: InputMaybe<Order_By>;
  /** Timestamp when the note was created */
  created_at?: InputMaybe<Order_By>;
  /** Identifier of the entity this note is attached to */
  entity_id?: InputMaybe<Order_By>;
  /** Type of entity this note is attached to (client, payroll, etc.) */
  entity_type?: InputMaybe<Order_By>;
  /** Unique identifier for the note */
  id?: InputMaybe<Order_By>;
  /** Timestamp when the note was last updated */
  updated_at?: InputMaybe<Order_By>;
  /** User who created the note */
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "notes" */
export type Notes_Mutation_Response = {
  __typename: "notes_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Notes>;
};

/** on_conflict condition type for table "notes" */
export type Notes_On_Conflict = {
  constraint: Notes_Constraint;
  update_columns?: Array<Notes_Update_Column>;
  where?: InputMaybe<Notes_Bool_Exp>;
};

/** Ordering options when selecting data from "notes". */
export type Notes_Order_By = {
  content?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  entity_id?: InputMaybe<Order_By>;
  entity_type?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_important?: InputMaybe<Order_By>;
  notes_by_client_aggregate?: InputMaybe<Clients_Aggregate_Order_By>;
  notes_by_payroll_aggregate?: InputMaybe<Payrolls_Aggregate_Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: notes */
export type Notes_Pk_Columns_Input = {
  /** Unique identifier for the note */
  id: Scalars["uuid"]["input"];
};

/** select columns of table "notes" */
export type Notes_Select_Column =
  /** column name */
  | "content"
  /** column name */
  | "created_at"
  /** column name */
  | "entity_id"
  /** column name */
  | "entity_type"
  /** column name */
  | "id"
  /** column name */
  | "is_important"
  /** column name */
  | "updated_at"
  /** column name */
  | "user_id";

/** select "notes_aggregate_bool_exp_bool_and_arguments_columns" columns of table "notes" */
export type Notes_Select_Column_Notes_Aggregate_Bool_Exp_Bool_And_Arguments_Columns =
  /** column name */
  "is_important";

/** select "notes_aggregate_bool_exp_bool_or_arguments_columns" columns of table "notes" */
export type Notes_Select_Column_Notes_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns =
  /** column name */
  "is_important";

/** input type for updating data in table "notes" */
export type Notes_Set_Input = {
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
export type Notes_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Notes_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Notes_Stream_Cursor_Value_Input = {
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
export type Notes_Update_Column =
  /** column name */
  | "content"
  /** column name */
  | "created_at"
  /** column name */
  | "entity_id"
  /** column name */
  | "entity_type"
  /** column name */
  | "id"
  /** column name */
  | "is_important"
  /** column name */
  | "updated_at"
  /** column name */
  | "user_id";

export type Notes_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Notes_Set_Input>;
  /** filter the rows which have to be updated */
  where: Notes_Bool_Exp;
};

/** Boolean expression to compare columns of type "numeric". All fields are combined with logical 'AND'. */
export type Numeric_Comparison_Exp = {
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
export type Order_By =
  /** in ascending order, nulls last */
  | "asc"
  /** in ascending order, nulls first */
  | "asc_nulls_first"
  /** in ascending order, nulls last */
  | "asc_nulls_last"
  /** in descending order, nulls first */
  | "desc"
  /** in descending order, nulls first */
  | "desc_nulls_first"
  /** in descending order, nulls last */
  | "desc_nulls_last";

/** columns and relationships of "payroll_activation_results" */
export type Payroll_Activation_Results = {
  __typename: "payroll_activation_results";
  action_taken: Scalars["String"]["output"];
  executed_at: Maybe<Scalars["timestamptz"]["output"]>;
  id: Scalars["uuid"]["output"];
  payroll_id: Scalars["uuid"]["output"];
  version_number: Scalars["Int"]["output"];
};

/** aggregated selection of "payroll_activation_results" */
export type Payroll_Activation_Results_Aggregate = {
  __typename: "payroll_activation_results_aggregate";
  aggregate: Maybe<Payroll_Activation_Results_Aggregate_Fields>;
  nodes: Array<Payroll_Activation_Results>;
};

/** aggregate fields of "payroll_activation_results" */
export type Payroll_Activation_Results_Aggregate_Fields = {
  __typename: "payroll_activation_results_aggregate_fields";
  avg: Maybe<Payroll_Activation_Results_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max: Maybe<Payroll_Activation_Results_Max_Fields>;
  min: Maybe<Payroll_Activation_Results_Min_Fields>;
  stddev: Maybe<Payroll_Activation_Results_Stddev_Fields>;
  stddev_pop: Maybe<Payroll_Activation_Results_Stddev_Pop_Fields>;
  stddev_samp: Maybe<Payroll_Activation_Results_Stddev_Samp_Fields>;
  sum: Maybe<Payroll_Activation_Results_Sum_Fields>;
  var_pop: Maybe<Payroll_Activation_Results_Var_Pop_Fields>;
  var_samp: Maybe<Payroll_Activation_Results_Var_Samp_Fields>;
  variance: Maybe<Payroll_Activation_Results_Variance_Fields>;
};

/** aggregate fields of "payroll_activation_results" */
export type Payroll_Activation_Results_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Payroll_Activation_Results_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** aggregate avg on columns */
export type Payroll_Activation_Results_Avg_Fields = {
  __typename: "payroll_activation_results_avg_fields";
  version_number: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to filter rows from the table "payroll_activation_results". All fields are combined with a logical 'AND'. */
export type Payroll_Activation_Results_Bool_Exp = {
  _and?: InputMaybe<Array<Payroll_Activation_Results_Bool_Exp>>;
  _not?: InputMaybe<Payroll_Activation_Results_Bool_Exp>;
  _or?: InputMaybe<Array<Payroll_Activation_Results_Bool_Exp>>;
  action_taken?: InputMaybe<String_Comparison_Exp>;
  executed_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  payroll_id?: InputMaybe<Uuid_Comparison_Exp>;
  version_number?: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "payroll_activation_results" */
export type Payroll_Activation_Results_Constraint =
  /** unique or primary key constraint on columns "id" */
  "payroll_activation_results_pkey";

/** input type for incrementing numeric columns in table "payroll_activation_results" */
export type Payroll_Activation_Results_Inc_Input = {
  version_number?: InputMaybe<Scalars["Int"]["input"]>;
};

/** input type for inserting data into table "payroll_activation_results" */
export type Payroll_Activation_Results_Insert_Input = {
  action_taken?: InputMaybe<Scalars["String"]["input"]>;
  executed_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  payroll_id?: InputMaybe<Scalars["uuid"]["input"]>;
  version_number?: InputMaybe<Scalars["Int"]["input"]>;
};

/** aggregate max on columns */
export type Payroll_Activation_Results_Max_Fields = {
  __typename: "payroll_activation_results_max_fields";
  action_taken: Maybe<Scalars["String"]["output"]>;
  executed_at: Maybe<Scalars["timestamptz"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  payroll_id: Maybe<Scalars["uuid"]["output"]>;
  version_number: Maybe<Scalars["Int"]["output"]>;
};

/** aggregate min on columns */
export type Payroll_Activation_Results_Min_Fields = {
  __typename: "payroll_activation_results_min_fields";
  action_taken: Maybe<Scalars["String"]["output"]>;
  executed_at: Maybe<Scalars["timestamptz"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  payroll_id: Maybe<Scalars["uuid"]["output"]>;
  version_number: Maybe<Scalars["Int"]["output"]>;
};

/** response of any mutation on the table "payroll_activation_results" */
export type Payroll_Activation_Results_Mutation_Response = {
  __typename: "payroll_activation_results_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Payroll_Activation_Results>;
};

/** on_conflict condition type for table "payroll_activation_results" */
export type Payroll_Activation_Results_On_Conflict = {
  constraint: Payroll_Activation_Results_Constraint;
  update_columns?: Array<Payroll_Activation_Results_Update_Column>;
  where?: InputMaybe<Payroll_Activation_Results_Bool_Exp>;
};

/** Ordering options when selecting data from "payroll_activation_results". */
export type Payroll_Activation_Results_Order_By = {
  action_taken?: InputMaybe<Order_By>;
  executed_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  payroll_id?: InputMaybe<Order_By>;
  version_number?: InputMaybe<Order_By>;
};

/** primary key columns input for table: payroll_activation_results */
export type Payroll_Activation_Results_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "payroll_activation_results" */
export type Payroll_Activation_Results_Select_Column =
  /** column name */
  | "action_taken"
  /** column name */
  | "executed_at"
  /** column name */
  | "id"
  /** column name */
  | "payroll_id"
  /** column name */
  | "version_number";

/** input type for updating data in table "payroll_activation_results" */
export type Payroll_Activation_Results_Set_Input = {
  action_taken?: InputMaybe<Scalars["String"]["input"]>;
  executed_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  payroll_id?: InputMaybe<Scalars["uuid"]["input"]>;
  version_number?: InputMaybe<Scalars["Int"]["input"]>;
};

/** aggregate stddev on columns */
export type Payroll_Activation_Results_Stddev_Fields = {
  __typename: "payroll_activation_results_stddev_fields";
  version_number: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type Payroll_Activation_Results_Stddev_Pop_Fields = {
  __typename: "payroll_activation_results_stddev_pop_fields";
  version_number: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type Payroll_Activation_Results_Stddev_Samp_Fields = {
  __typename: "payroll_activation_results_stddev_samp_fields";
  version_number: Maybe<Scalars["Float"]["output"]>;
};

/** Streaming cursor of the table "payroll_activation_results" */
export type Payroll_Activation_Results_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Payroll_Activation_Results_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Payroll_Activation_Results_Stream_Cursor_Value_Input = {
  action_taken?: InputMaybe<Scalars["String"]["input"]>;
  executed_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  payroll_id?: InputMaybe<Scalars["uuid"]["input"]>;
  version_number?: InputMaybe<Scalars["Int"]["input"]>;
};

/** aggregate sum on columns */
export type Payroll_Activation_Results_Sum_Fields = {
  __typename: "payroll_activation_results_sum_fields";
  version_number: Maybe<Scalars["Int"]["output"]>;
};

/** update columns of table "payroll_activation_results" */
export type Payroll_Activation_Results_Update_Column =
  /** column name */
  | "action_taken"
  /** column name */
  | "executed_at"
  /** column name */
  | "id"
  /** column name */
  | "payroll_id"
  /** column name */
  | "version_number";

export type Payroll_Activation_Results_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Payroll_Activation_Results_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Payroll_Activation_Results_Set_Input>;
  /** filter the rows which have to be updated */
  where: Payroll_Activation_Results_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Payroll_Activation_Results_Var_Pop_Fields = {
  __typename: "payroll_activation_results_var_pop_fields";
  version_number: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate var_samp on columns */
export type Payroll_Activation_Results_Var_Samp_Fields = {
  __typename: "payroll_activation_results_var_samp_fields";
  version_number: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate variance on columns */
export type Payroll_Activation_Results_Variance_Fields = {
  __typename: "payroll_activation_results_variance_fields";
  version_number: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to compare columns of type "payroll_cycle_type". All fields are combined with logical 'AND'. */
export type Payroll_Cycle_Type_Comparison_Exp = {
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
export type Payroll_Cycles = {
  __typename: "payroll_cycles";
  /** An array relationship */
  adjustment_rules: Array<Adjustment_Rules>;
  /** An aggregate relationship */
  adjustment_rules_aggregate: Adjustment_Rules_Aggregate;
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
  payrolls_aggregate: Payrolls_Aggregate;
  /** Timestamp when the cycle was last updated */
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
};

/** columns and relationships of "payroll_cycles" */
export type Payroll_CyclesAdjustment_RulesArgs = {
  distinct_on?: InputMaybe<Array<Adjustment_Rules_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Adjustment_Rules_Order_By>>;
  where?: InputMaybe<Adjustment_Rules_Bool_Exp>;
};

/** columns and relationships of "payroll_cycles" */
export type Payroll_CyclesAdjustment_Rules_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Adjustment_Rules_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Adjustment_Rules_Order_By>>;
  where?: InputMaybe<Adjustment_Rules_Bool_Exp>;
};

/** columns and relationships of "payroll_cycles" */
export type Payroll_CyclesPayrollsArgs = {
  distinct_on?: InputMaybe<Array<Payrolls_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payrolls_Order_By>>;
  where?: InputMaybe<Payrolls_Bool_Exp>;
};

/** columns and relationships of "payroll_cycles" */
export type Payroll_CyclesPayrolls_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payrolls_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payrolls_Order_By>>;
  where?: InputMaybe<Payrolls_Bool_Exp>;
};

/** aggregated selection of "payroll_cycles" */
export type Payroll_Cycles_Aggregate = {
  __typename: "payroll_cycles_aggregate";
  aggregate: Maybe<Payroll_Cycles_Aggregate_Fields>;
  nodes: Array<Payroll_Cycles>;
};

/** aggregate fields of "payroll_cycles" */
export type Payroll_Cycles_Aggregate_Fields = {
  __typename: "payroll_cycles_aggregate_fields";
  count: Scalars["Int"]["output"];
  max: Maybe<Payroll_Cycles_Max_Fields>;
  min: Maybe<Payroll_Cycles_Min_Fields>;
};

/** aggregate fields of "payroll_cycles" */
export type Payroll_Cycles_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Payroll_Cycles_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** Boolean expression to filter rows from the table "payroll_cycles". All fields are combined with a logical 'AND'. */
export type Payroll_Cycles_Bool_Exp = {
  _and?: InputMaybe<Array<Payroll_Cycles_Bool_Exp>>;
  _not?: InputMaybe<Payroll_Cycles_Bool_Exp>;
  _or?: InputMaybe<Array<Payroll_Cycles_Bool_Exp>>;
  adjustment_rules?: InputMaybe<Adjustment_Rules_Bool_Exp>;
  adjustment_rules_aggregate?: InputMaybe<Adjustment_Rules_Aggregate_Bool_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<Payroll_Cycle_Type_Comparison_Exp>;
  payrolls?: InputMaybe<Payrolls_Bool_Exp>;
  payrolls_aggregate?: InputMaybe<Payrolls_Aggregate_Bool_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "payroll_cycles" */
export type Payroll_Cycles_Constraint =
  /** unique or primary key constraint on columns "name" */
  | "payroll_cycles_name_key"
  /** unique or primary key constraint on columns "id" */
  | "payroll_cycles_pkey";

/** input type for inserting data into table "payroll_cycles" */
export type Payroll_Cycles_Insert_Input = {
  adjustment_rules?: InputMaybe<Adjustment_Rules_Arr_Rel_Insert_Input>;
  /** Timestamp when the cycle was created */
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  /** Detailed description of the payroll cycle */
  description?: InputMaybe<Scalars["String"]["input"]>;
  /** Unique identifier for the payroll cycle */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Name of the payroll cycle (Weekly, Biweekly, Monthly, etc.) */
  name?: InputMaybe<Scalars["payroll_cycle_type"]["input"]>;
  payrolls?: InputMaybe<Payrolls_Arr_Rel_Insert_Input>;
  /** Timestamp when the cycle was last updated */
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** aggregate max on columns */
export type Payroll_Cycles_Max_Fields = {
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
export type Payroll_Cycles_Min_Fields = {
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
export type Payroll_Cycles_Mutation_Response = {
  __typename: "payroll_cycles_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Payroll_Cycles>;
};

/** input type for inserting object relation for remote table "payroll_cycles" */
export type Payroll_Cycles_Obj_Rel_Insert_Input = {
  data: Payroll_Cycles_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Payroll_Cycles_On_Conflict>;
};

/** on_conflict condition type for table "payroll_cycles" */
export type Payroll_Cycles_On_Conflict = {
  constraint: Payroll_Cycles_Constraint;
  update_columns?: Array<Payroll_Cycles_Update_Column>;
  where?: InputMaybe<Payroll_Cycles_Bool_Exp>;
};

/** Ordering options when selecting data from "payroll_cycles". */
export type Payroll_Cycles_Order_By = {
  adjustment_rules_aggregate?: InputMaybe<Adjustment_Rules_Aggregate_Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  payrolls_aggregate?: InputMaybe<Payrolls_Aggregate_Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: payroll_cycles */
export type Payroll_Cycles_Pk_Columns_Input = {
  /** Unique identifier for the payroll cycle */
  id: Scalars["uuid"]["input"];
};

/** select columns of table "payroll_cycles" */
export type Payroll_Cycles_Select_Column =
  /** column name */
  | "created_at"
  /** column name */
  | "description"
  /** column name */
  | "id"
  /** column name */
  | "name"
  /** column name */
  | "updated_at";

/** input type for updating data in table "payroll_cycles" */
export type Payroll_Cycles_Set_Input = {
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
export type Payroll_Cycles_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Payroll_Cycles_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Payroll_Cycles_Stream_Cursor_Value_Input = {
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
export type Payroll_Cycles_Update_Column =
  /** column name */
  | "created_at"
  /** column name */
  | "description"
  /** column name */
  | "id"
  /** column name */
  | "name"
  /** column name */
  | "updated_at";

export type Payroll_Cycles_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Payroll_Cycles_Set_Input>;
  /** filter the rows which have to be updated */
  where: Payroll_Cycles_Bool_Exp;
};

/** Boolean expression to compare columns of type "payroll_date_type". All fields are combined with logical 'AND'. */
export type Payroll_Date_Type_Comparison_Exp = {
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
export type Payroll_Date_Types = {
  __typename: "payroll_date_types";
  /** An array relationship */
  adjustment_rules: Array<Adjustment_Rules>;
  /** An aggregate relationship */
  adjustment_rules_aggregate: Adjustment_Rules_Aggregate;
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
  payrolls_aggregate: Payrolls_Aggregate;
  /** Timestamp when the date type was last updated */
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
};

/** columns and relationships of "payroll_date_types" */
export type Payroll_Date_TypesAdjustment_RulesArgs = {
  distinct_on?: InputMaybe<Array<Adjustment_Rules_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Adjustment_Rules_Order_By>>;
  where?: InputMaybe<Adjustment_Rules_Bool_Exp>;
};

/** columns and relationships of "payroll_date_types" */
export type Payroll_Date_TypesAdjustment_Rules_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Adjustment_Rules_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Adjustment_Rules_Order_By>>;
  where?: InputMaybe<Adjustment_Rules_Bool_Exp>;
};

/** columns and relationships of "payroll_date_types" */
export type Payroll_Date_TypesPayrollsArgs = {
  distinct_on?: InputMaybe<Array<Payrolls_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payrolls_Order_By>>;
  where?: InputMaybe<Payrolls_Bool_Exp>;
};

/** columns and relationships of "payroll_date_types" */
export type Payroll_Date_TypesPayrolls_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payrolls_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payrolls_Order_By>>;
  where?: InputMaybe<Payrolls_Bool_Exp>;
};

/** aggregated selection of "payroll_date_types" */
export type Payroll_Date_Types_Aggregate = {
  __typename: "payroll_date_types_aggregate";
  aggregate: Maybe<Payroll_Date_Types_Aggregate_Fields>;
  nodes: Array<Payroll_Date_Types>;
};

/** aggregate fields of "payroll_date_types" */
export type Payroll_Date_Types_Aggregate_Fields = {
  __typename: "payroll_date_types_aggregate_fields";
  count: Scalars["Int"]["output"];
  max: Maybe<Payroll_Date_Types_Max_Fields>;
  min: Maybe<Payroll_Date_Types_Min_Fields>;
};

/** aggregate fields of "payroll_date_types" */
export type Payroll_Date_Types_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Payroll_Date_Types_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** Boolean expression to filter rows from the table "payroll_date_types". All fields are combined with a logical 'AND'. */
export type Payroll_Date_Types_Bool_Exp = {
  _and?: InputMaybe<Array<Payroll_Date_Types_Bool_Exp>>;
  _not?: InputMaybe<Payroll_Date_Types_Bool_Exp>;
  _or?: InputMaybe<Array<Payroll_Date_Types_Bool_Exp>>;
  adjustment_rules?: InputMaybe<Adjustment_Rules_Bool_Exp>;
  adjustment_rules_aggregate?: InputMaybe<Adjustment_Rules_Aggregate_Bool_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<Payroll_Date_Type_Comparison_Exp>;
  payrolls?: InputMaybe<Payrolls_Bool_Exp>;
  payrolls_aggregate?: InputMaybe<Payrolls_Aggregate_Bool_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "payroll_date_types" */
export type Payroll_Date_Types_Constraint =
  /** unique or primary key constraint on columns "name" */
  | "payroll_date_types_name_key"
  /** unique or primary key constraint on columns "id" */
  | "payroll_date_types_pkey";

/** input type for inserting data into table "payroll_date_types" */
export type Payroll_Date_Types_Insert_Input = {
  adjustment_rules?: InputMaybe<Adjustment_Rules_Arr_Rel_Insert_Input>;
  /** Timestamp when the date type was created */
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  /** Detailed description of how this date type works */
  description?: InputMaybe<Scalars["String"]["input"]>;
  /** Unique identifier for the payroll date type */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Name of the date type (Fixed, Last Working Day, etc.) */
  name?: InputMaybe<Scalars["payroll_date_type"]["input"]>;
  payrolls?: InputMaybe<Payrolls_Arr_Rel_Insert_Input>;
  /** Timestamp when the date type was last updated */
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** aggregate max on columns */
export type Payroll_Date_Types_Max_Fields = {
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
export type Payroll_Date_Types_Min_Fields = {
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
export type Payroll_Date_Types_Mutation_Response = {
  __typename: "payroll_date_types_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Payroll_Date_Types>;
};

/** input type for inserting object relation for remote table "payroll_date_types" */
export type Payroll_Date_Types_Obj_Rel_Insert_Input = {
  data: Payroll_Date_Types_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Payroll_Date_Types_On_Conflict>;
};

/** on_conflict condition type for table "payroll_date_types" */
export type Payroll_Date_Types_On_Conflict = {
  constraint: Payroll_Date_Types_Constraint;
  update_columns?: Array<Payroll_Date_Types_Update_Column>;
  where?: InputMaybe<Payroll_Date_Types_Bool_Exp>;
};

/** Ordering options when selecting data from "payroll_date_types". */
export type Payroll_Date_Types_Order_By = {
  adjustment_rules_aggregate?: InputMaybe<Adjustment_Rules_Aggregate_Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  payrolls_aggregate?: InputMaybe<Payrolls_Aggregate_Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: payroll_date_types */
export type Payroll_Date_Types_Pk_Columns_Input = {
  /** Unique identifier for the payroll date type */
  id: Scalars["uuid"]["input"];
};

/** select columns of table "payroll_date_types" */
export type Payroll_Date_Types_Select_Column =
  /** column name */
  | "created_at"
  /** column name */
  | "description"
  /** column name */
  | "id"
  /** column name */
  | "name"
  /** column name */
  | "updated_at";

/** input type for updating data in table "payroll_date_types" */
export type Payroll_Date_Types_Set_Input = {
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
export type Payroll_Date_Types_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Payroll_Date_Types_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Payroll_Date_Types_Stream_Cursor_Value_Input = {
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
export type Payroll_Date_Types_Update_Column =
  /** column name */
  | "created_at"
  /** column name */
  | "description"
  /** column name */
  | "id"
  /** column name */
  | "name"
  /** column name */
  | "updated_at";

export type Payroll_Date_Types_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Payroll_Date_Types_Set_Input>;
  /** filter the rows which have to be updated */
  where: Payroll_Date_Types_Bool_Exp;
};

/** columns and relationships of "payroll_dates" */
export type Payroll_Dates = {
  __typename: "payroll_dates";
  /** Final EFT date after holiday and weekend adjustments */
  adjusted_eft_date: Scalars["date"]["output"];
  /** Timestamp when the date record was created */
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  /** Unique identifier for the payroll date */
  id: Scalars["uuid"]["output"];
  /** Additional notes about this payroll date */
  notes: Maybe<Scalars["String"]["output"]>;
  /** Originally calculated EFT date before adjustments */
  original_eft_date: Scalars["date"]["output"];
  /** An object relationship */
  payroll: Payrolls;
  /** Reference to the payroll this date belongs to */
  payroll_id: Scalars["uuid"]["output"];
  /** Date when payroll processing must be completed */
  processing_date: Scalars["date"]["output"];
  /** Timestamp when the date record was last updated */
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
};

/** aggregated selection of "payroll_dates" */
export type Payroll_Dates_Aggregate = {
  __typename: "payroll_dates_aggregate";
  aggregate: Maybe<Payroll_Dates_Aggregate_Fields>;
  nodes: Array<Payroll_Dates>;
};

export type Payroll_Dates_Aggregate_Bool_Exp = {
  count?: InputMaybe<Payroll_Dates_Aggregate_Bool_Exp_Count>;
};

export type Payroll_Dates_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Payroll_Dates_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Payroll_Dates_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "payroll_dates" */
export type Payroll_Dates_Aggregate_Fields = {
  __typename: "payroll_dates_aggregate_fields";
  count: Scalars["Int"]["output"];
  max: Maybe<Payroll_Dates_Max_Fields>;
  min: Maybe<Payroll_Dates_Min_Fields>;
};

/** aggregate fields of "payroll_dates" */
export type Payroll_Dates_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Payroll_Dates_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "payroll_dates" */
export type Payroll_Dates_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Payroll_Dates_Max_Order_By>;
  min?: InputMaybe<Payroll_Dates_Min_Order_By>;
};

/** input type for inserting array relation for remote table "payroll_dates" */
export type Payroll_Dates_Arr_Rel_Insert_Input = {
  data: Array<Payroll_Dates_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Payroll_Dates_On_Conflict>;
};

/** Boolean expression to filter rows from the table "payroll_dates". All fields are combined with a logical 'AND'. */
export type Payroll_Dates_Bool_Exp = {
  _and?: InputMaybe<Array<Payroll_Dates_Bool_Exp>>;
  _not?: InputMaybe<Payroll_Dates_Bool_Exp>;
  _or?: InputMaybe<Array<Payroll_Dates_Bool_Exp>>;
  adjusted_eft_date?: InputMaybe<Date_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  notes?: InputMaybe<String_Comparison_Exp>;
  original_eft_date?: InputMaybe<Date_Comparison_Exp>;
  payroll?: InputMaybe<Payrolls_Bool_Exp>;
  payroll_id?: InputMaybe<Uuid_Comparison_Exp>;
  processing_date?: InputMaybe<Date_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "payroll_dates" */
export type Payroll_Dates_Constraint =
  /** unique or primary key constraint on columns "original_eft_date", "payroll_id" */
  | "idx_unique_payroll_date"
  /** unique or primary key constraint on columns "id" */
  | "payroll_dates_pkey";

/** input type for inserting data into table "payroll_dates" */
export type Payroll_Dates_Insert_Input = {
  /** Final EFT date after holiday and weekend adjustments */
  adjusted_eft_date?: InputMaybe<Scalars["date"]["input"]>;
  /** Timestamp when the date record was created */
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  /** Unique identifier for the payroll date */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Additional notes about this payroll date */
  notes?: InputMaybe<Scalars["String"]["input"]>;
  /** Originally calculated EFT date before adjustments */
  original_eft_date?: InputMaybe<Scalars["date"]["input"]>;
  payroll?: InputMaybe<Payrolls_Obj_Rel_Insert_Input>;
  /** Reference to the payroll this date belongs to */
  payroll_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Date when payroll processing must be completed */
  processing_date?: InputMaybe<Scalars["date"]["input"]>;
  /** Timestamp when the date record was last updated */
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** aggregate max on columns */
export type Payroll_Dates_Max_Fields = {
  __typename: "payroll_dates_max_fields";
  /** Final EFT date after holiday and weekend adjustments */
  adjusted_eft_date: Maybe<Scalars["date"]["output"]>;
  /** Timestamp when the date record was created */
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  /** Unique identifier for the payroll date */
  id: Maybe<Scalars["uuid"]["output"]>;
  /** Additional notes about this payroll date */
  notes: Maybe<Scalars["String"]["output"]>;
  /** Originally calculated EFT date before adjustments */
  original_eft_date: Maybe<Scalars["date"]["output"]>;
  /** Reference to the payroll this date belongs to */
  payroll_id: Maybe<Scalars["uuid"]["output"]>;
  /** Date when payroll processing must be completed */
  processing_date: Maybe<Scalars["date"]["output"]>;
  /** Timestamp when the date record was last updated */
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
};

/** order by max() on columns of table "payroll_dates" */
export type Payroll_Dates_Max_Order_By = {
  /** Final EFT date after holiday and weekend adjustments */
  adjusted_eft_date?: InputMaybe<Order_By>;
  /** Timestamp when the date record was created */
  created_at?: InputMaybe<Order_By>;
  /** Unique identifier for the payroll date */
  id?: InputMaybe<Order_By>;
  /** Additional notes about this payroll date */
  notes?: InputMaybe<Order_By>;
  /** Originally calculated EFT date before adjustments */
  original_eft_date?: InputMaybe<Order_By>;
  /** Reference to the payroll this date belongs to */
  payroll_id?: InputMaybe<Order_By>;
  /** Date when payroll processing must be completed */
  processing_date?: InputMaybe<Order_By>;
  /** Timestamp when the date record was last updated */
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Payroll_Dates_Min_Fields = {
  __typename: "payroll_dates_min_fields";
  /** Final EFT date after holiday and weekend adjustments */
  adjusted_eft_date: Maybe<Scalars["date"]["output"]>;
  /** Timestamp when the date record was created */
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  /** Unique identifier for the payroll date */
  id: Maybe<Scalars["uuid"]["output"]>;
  /** Additional notes about this payroll date */
  notes: Maybe<Scalars["String"]["output"]>;
  /** Originally calculated EFT date before adjustments */
  original_eft_date: Maybe<Scalars["date"]["output"]>;
  /** Reference to the payroll this date belongs to */
  payroll_id: Maybe<Scalars["uuid"]["output"]>;
  /** Date when payroll processing must be completed */
  processing_date: Maybe<Scalars["date"]["output"]>;
  /** Timestamp when the date record was last updated */
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
};

/** order by min() on columns of table "payroll_dates" */
export type Payroll_Dates_Min_Order_By = {
  /** Final EFT date after holiday and weekend adjustments */
  adjusted_eft_date?: InputMaybe<Order_By>;
  /** Timestamp when the date record was created */
  created_at?: InputMaybe<Order_By>;
  /** Unique identifier for the payroll date */
  id?: InputMaybe<Order_By>;
  /** Additional notes about this payroll date */
  notes?: InputMaybe<Order_By>;
  /** Originally calculated EFT date before adjustments */
  original_eft_date?: InputMaybe<Order_By>;
  /** Reference to the payroll this date belongs to */
  payroll_id?: InputMaybe<Order_By>;
  /** Date when payroll processing must be completed */
  processing_date?: InputMaybe<Order_By>;
  /** Timestamp when the date record was last updated */
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "payroll_dates" */
export type Payroll_Dates_Mutation_Response = {
  __typename: "payroll_dates_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Payroll_Dates>;
};

/** on_conflict condition type for table "payroll_dates" */
export type Payroll_Dates_On_Conflict = {
  constraint: Payroll_Dates_Constraint;
  update_columns?: Array<Payroll_Dates_Update_Column>;
  where?: InputMaybe<Payroll_Dates_Bool_Exp>;
};

/** Ordering options when selecting data from "payroll_dates". */
export type Payroll_Dates_Order_By = {
  adjusted_eft_date?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  notes?: InputMaybe<Order_By>;
  original_eft_date?: InputMaybe<Order_By>;
  payroll?: InputMaybe<Payrolls_Order_By>;
  payroll_id?: InputMaybe<Order_By>;
  processing_date?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: payroll_dates */
export type Payroll_Dates_Pk_Columns_Input = {
  /** Unique identifier for the payroll date */
  id: Scalars["uuid"]["input"];
};

/** select columns of table "payroll_dates" */
export type Payroll_Dates_Select_Column =
  /** column name */
  | "adjusted_eft_date"
  /** column name */
  | "created_at"
  /** column name */
  | "id"
  /** column name */
  | "notes"
  /** column name */
  | "original_eft_date"
  /** column name */
  | "payroll_id"
  /** column name */
  | "processing_date"
  /** column name */
  | "updated_at";

/** input type for updating data in table "payroll_dates" */
export type Payroll_Dates_Set_Input = {
  /** Final EFT date after holiday and weekend adjustments */
  adjusted_eft_date?: InputMaybe<Scalars["date"]["input"]>;
  /** Timestamp when the date record was created */
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  /** Unique identifier for the payroll date */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Additional notes about this payroll date */
  notes?: InputMaybe<Scalars["String"]["input"]>;
  /** Originally calculated EFT date before adjustments */
  original_eft_date?: InputMaybe<Scalars["date"]["input"]>;
  /** Reference to the payroll this date belongs to */
  payroll_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Date when payroll processing must be completed */
  processing_date?: InputMaybe<Scalars["date"]["input"]>;
  /** Timestamp when the date record was last updated */
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** Streaming cursor of the table "payroll_dates" */
export type Payroll_Dates_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Payroll_Dates_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Payroll_Dates_Stream_Cursor_Value_Input = {
  /** Final EFT date after holiday and weekend adjustments */
  adjusted_eft_date?: InputMaybe<Scalars["date"]["input"]>;
  /** Timestamp when the date record was created */
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  /** Unique identifier for the payroll date */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Additional notes about this payroll date */
  notes?: InputMaybe<Scalars["String"]["input"]>;
  /** Originally calculated EFT date before adjustments */
  original_eft_date?: InputMaybe<Scalars["date"]["input"]>;
  /** Reference to the payroll this date belongs to */
  payroll_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Date when payroll processing must be completed */
  processing_date?: InputMaybe<Scalars["date"]["input"]>;
  /** Timestamp when the date record was last updated */
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** update columns of table "payroll_dates" */
export type Payroll_Dates_Update_Column =
  /** column name */
  | "adjusted_eft_date"
  /** column name */
  | "created_at"
  /** column name */
  | "id"
  /** column name */
  | "notes"
  /** column name */
  | "original_eft_date"
  /** column name */
  | "payroll_id"
  /** column name */
  | "processing_date"
  /** column name */
  | "updated_at";

export type Payroll_Dates_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Payroll_Dates_Set_Input>;
  /** filter the rows which have to be updated */
  where: Payroll_Dates_Bool_Exp;
};

/** Boolean expression to compare columns of type "payroll_status". All fields are combined with logical 'AND'. */
export type Payroll_Status_Comparison_Exp = {
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

/** columns and relationships of "payroll_version_history_results" */
export type Payroll_Version_History_Results = {
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

/** aggregated selection of "payroll_version_history_results" */
export type Payroll_Version_History_Results_Aggregate = {
  __typename: "payroll_version_history_results_aggregate";
  aggregate: Maybe<Payroll_Version_History_Results_Aggregate_Fields>;
  nodes: Array<Payroll_Version_History_Results>;
};

/** aggregate fields of "payroll_version_history_results" */
export type Payroll_Version_History_Results_Aggregate_Fields = {
  __typename: "payroll_version_history_results_aggregate_fields";
  avg: Maybe<Payroll_Version_History_Results_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max: Maybe<Payroll_Version_History_Results_Max_Fields>;
  min: Maybe<Payroll_Version_History_Results_Min_Fields>;
  stddev: Maybe<Payroll_Version_History_Results_Stddev_Fields>;
  stddev_pop: Maybe<Payroll_Version_History_Results_Stddev_Pop_Fields>;
  stddev_samp: Maybe<Payroll_Version_History_Results_Stddev_Samp_Fields>;
  sum: Maybe<Payroll_Version_History_Results_Sum_Fields>;
  var_pop: Maybe<Payroll_Version_History_Results_Var_Pop_Fields>;
  var_samp: Maybe<Payroll_Version_History_Results_Var_Samp_Fields>;
  variance: Maybe<Payroll_Version_History_Results_Variance_Fields>;
};

/** aggregate fields of "payroll_version_history_results" */
export type Payroll_Version_History_Results_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Payroll_Version_History_Results_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** aggregate avg on columns */
export type Payroll_Version_History_Results_Avg_Fields = {
  __typename: "payroll_version_history_results_avg_fields";
  version_number: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to filter rows from the table "payroll_version_history_results". All fields are combined with a logical 'AND'. */
export type Payroll_Version_History_Results_Bool_Exp = {
  _and?: InputMaybe<Array<Payroll_Version_History_Results_Bool_Exp>>;
  _not?: InputMaybe<Payroll_Version_History_Results_Bool_Exp>;
  _or?: InputMaybe<Array<Payroll_Version_History_Results_Bool_Exp>>;
  active?: InputMaybe<Boolean_Comparison_Exp>;
  go_live_date?: InputMaybe<Date_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  is_current?: InputMaybe<Boolean_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  payroll_id?: InputMaybe<Uuid_Comparison_Exp>;
  queried_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  superseded_date?: InputMaybe<Date_Comparison_Exp>;
  version_number?: InputMaybe<Int_Comparison_Exp>;
  version_reason?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "payroll_version_history_results" */
export type Payroll_Version_History_Results_Constraint =
  /** unique or primary key constraint on columns "id" */
  "payroll_version_history_results_pkey";

/** input type for incrementing numeric columns in table "payroll_version_history_results" */
export type Payroll_Version_History_Results_Inc_Input = {
  version_number?: InputMaybe<Scalars["Int"]["input"]>;
};

/** input type for inserting data into table "payroll_version_history_results" */
export type Payroll_Version_History_Results_Insert_Input = {
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
export type Payroll_Version_History_Results_Max_Fields = {
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
export type Payroll_Version_History_Results_Min_Fields = {
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
export type Payroll_Version_History_Results_Mutation_Response = {
  __typename: "payroll_version_history_results_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Payroll_Version_History_Results>;
};

/** on_conflict condition type for table "payroll_version_history_results" */
export type Payroll_Version_History_Results_On_Conflict = {
  constraint: Payroll_Version_History_Results_Constraint;
  update_columns?: Array<Payroll_Version_History_Results_Update_Column>;
  where?: InputMaybe<Payroll_Version_History_Results_Bool_Exp>;
};

/** Ordering options when selecting data from "payroll_version_history_results". */
export type Payroll_Version_History_Results_Order_By = {
  active?: InputMaybe<Order_By>;
  go_live_date?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_current?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  payroll_id?: InputMaybe<Order_By>;
  queried_at?: InputMaybe<Order_By>;
  superseded_date?: InputMaybe<Order_By>;
  version_number?: InputMaybe<Order_By>;
  version_reason?: InputMaybe<Order_By>;
};

/** primary key columns input for table: payroll_version_history_results */
export type Payroll_Version_History_Results_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "payroll_version_history_results" */
export type Payroll_Version_History_Results_Select_Column =
  /** column name */
  | "active"
  /** column name */
  | "go_live_date"
  /** column name */
  | "id"
  /** column name */
  | "is_current"
  /** column name */
  | "name"
  /** column name */
  | "payroll_id"
  /** column name */
  | "queried_at"
  /** column name */
  | "superseded_date"
  /** column name */
  | "version_number"
  /** column name */
  | "version_reason";

/** input type for updating data in table "payroll_version_history_results" */
export type Payroll_Version_History_Results_Set_Input = {
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
export type Payroll_Version_History_Results_Stddev_Fields = {
  __typename: "payroll_version_history_results_stddev_fields";
  version_number: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type Payroll_Version_History_Results_Stddev_Pop_Fields = {
  __typename: "payroll_version_history_results_stddev_pop_fields";
  version_number: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type Payroll_Version_History_Results_Stddev_Samp_Fields = {
  __typename: "payroll_version_history_results_stddev_samp_fields";
  version_number: Maybe<Scalars["Float"]["output"]>;
};

/** Streaming cursor of the table "payroll_version_history_results" */
export type Payroll_Version_History_Results_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Payroll_Version_History_Results_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Payroll_Version_History_Results_Stream_Cursor_Value_Input = {
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
export type Payroll_Version_History_Results_Sum_Fields = {
  __typename: "payroll_version_history_results_sum_fields";
  version_number: Maybe<Scalars["Int"]["output"]>;
};

/** update columns of table "payroll_version_history_results" */
export type Payroll_Version_History_Results_Update_Column =
  /** column name */
  | "active"
  /** column name */
  | "go_live_date"
  /** column name */
  | "id"
  /** column name */
  | "is_current"
  /** column name */
  | "name"
  /** column name */
  | "payroll_id"
  /** column name */
  | "queried_at"
  /** column name */
  | "superseded_date"
  /** column name */
  | "version_number"
  /** column name */
  | "version_reason";

export type Payroll_Version_History_Results_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Payroll_Version_History_Results_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Payroll_Version_History_Results_Set_Input>;
  /** filter the rows which have to be updated */
  where: Payroll_Version_History_Results_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Payroll_Version_History_Results_Var_Pop_Fields = {
  __typename: "payroll_version_history_results_var_pop_fields";
  version_number: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate var_samp on columns */
export type Payroll_Version_History_Results_Var_Samp_Fields = {
  __typename: "payroll_version_history_results_var_samp_fields";
  version_number: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate variance on columns */
export type Payroll_Version_History_Results_Variance_Fields = {
  __typename: "payroll_version_history_results_variance_fields";
  version_number: Maybe<Scalars["Float"]["output"]>;
};

/** columns and relationships of "payroll_version_results" */
export type Payroll_Version_Results = {
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

export type Payroll_Version_Results_Aggregate = {
  __typename: "payroll_version_results_aggregate";
  aggregate: Maybe<Payroll_Version_Results_Aggregate_Fields>;
  nodes: Array<Payroll_Version_Results>;
};

/** aggregate fields of "payroll_version_results" */
export type Payroll_Version_Results_Aggregate_Fields = {
  __typename: "payroll_version_results_aggregate_fields";
  avg: Maybe<Payroll_Version_Results_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max: Maybe<Payroll_Version_Results_Max_Fields>;
  min: Maybe<Payroll_Version_Results_Min_Fields>;
  stddev: Maybe<Payroll_Version_Results_Stddev_Fields>;
  stddev_pop: Maybe<Payroll_Version_Results_Stddev_Pop_Fields>;
  stddev_samp: Maybe<Payroll_Version_Results_Stddev_Samp_Fields>;
  sum: Maybe<Payroll_Version_Results_Sum_Fields>;
  var_pop: Maybe<Payroll_Version_Results_Var_Pop_Fields>;
  var_samp: Maybe<Payroll_Version_Results_Var_Samp_Fields>;
  variance: Maybe<Payroll_Version_Results_Variance_Fields>;
};

/** aggregate fields of "payroll_version_results" */
export type Payroll_Version_Results_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Payroll_Version_Results_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** aggregate avg on columns */
export type Payroll_Version_Results_Avg_Fields = {
  __typename: "payroll_version_results_avg_fields";
  dates_deleted: Maybe<Scalars["Float"]["output"]>;
  new_version_number: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to filter rows from the table "payroll_version_results". All fields are combined with a logical 'AND'. */
export type Payroll_Version_Results_Bool_Exp = {
  _and?: InputMaybe<Array<Payroll_Version_Results_Bool_Exp>>;
  _not?: InputMaybe<Payroll_Version_Results_Bool_Exp>;
  _or?: InputMaybe<Array<Payroll_Version_Results_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  created_by_user_id?: InputMaybe<Uuid_Comparison_Exp>;
  dates_deleted?: InputMaybe<Int_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  message?: InputMaybe<String_Comparison_Exp>;
  new_payroll_id?: InputMaybe<Uuid_Comparison_Exp>;
  new_version_number?: InputMaybe<Int_Comparison_Exp>;
  old_payroll_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "payroll_version_results" */
export type Payroll_Version_Results_Constraint =
  /** unique or primary key constraint on columns "id" */
  "payroll_version_results_pkey";

/** input type for incrementing numeric columns in table "payroll_version_results" */
export type Payroll_Version_Results_Inc_Input = {
  dates_deleted?: InputMaybe<Scalars["Int"]["input"]>;
  new_version_number?: InputMaybe<Scalars["Int"]["input"]>;
};

/** input type for inserting data into table "payroll_version_results" */
export type Payroll_Version_Results_Insert_Input = {
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
export type Payroll_Version_Results_Max_Fields = {
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
export type Payroll_Version_Results_Min_Fields = {
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
export type Payroll_Version_Results_Mutation_Response = {
  __typename: "payroll_version_results_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Payroll_Version_Results>;
};

/** on_conflict condition type for table "payroll_version_results" */
export type Payroll_Version_Results_On_Conflict = {
  constraint: Payroll_Version_Results_Constraint;
  update_columns?: Array<Payroll_Version_Results_Update_Column>;
  where?: InputMaybe<Payroll_Version_Results_Bool_Exp>;
};

/** Ordering options when selecting data from "payroll_version_results". */
export type Payroll_Version_Results_Order_By = {
  created_at?: InputMaybe<Order_By>;
  created_by_user_id?: InputMaybe<Order_By>;
  dates_deleted?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  message?: InputMaybe<Order_By>;
  new_payroll_id?: InputMaybe<Order_By>;
  new_version_number?: InputMaybe<Order_By>;
  old_payroll_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: payroll_version_results */
export type Payroll_Version_Results_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "payroll_version_results" */
export type Payroll_Version_Results_Select_Column =
  /** column name */
  | "created_at"
  /** column name */
  | "created_by_user_id"
  /** column name */
  | "dates_deleted"
  /** column name */
  | "id"
  /** column name */
  | "message"
  /** column name */
  | "new_payroll_id"
  /** column name */
  | "new_version_number"
  /** column name */
  | "old_payroll_id";

/** input type for updating data in table "payroll_version_results" */
export type Payroll_Version_Results_Set_Input = {
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
export type Payroll_Version_Results_Stddev_Fields = {
  __typename: "payroll_version_results_stddev_fields";
  dates_deleted: Maybe<Scalars["Float"]["output"]>;
  new_version_number: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type Payroll_Version_Results_Stddev_Pop_Fields = {
  __typename: "payroll_version_results_stddev_pop_fields";
  dates_deleted: Maybe<Scalars["Float"]["output"]>;
  new_version_number: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type Payroll_Version_Results_Stddev_Samp_Fields = {
  __typename: "payroll_version_results_stddev_samp_fields";
  dates_deleted: Maybe<Scalars["Float"]["output"]>;
  new_version_number: Maybe<Scalars["Float"]["output"]>;
};

/** Streaming cursor of the table "payroll_version_results" */
export type Payroll_Version_Results_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Payroll_Version_Results_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Payroll_Version_Results_Stream_Cursor_Value_Input = {
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
export type Payroll_Version_Results_Sum_Fields = {
  __typename: "payroll_version_results_sum_fields";
  dates_deleted: Maybe<Scalars["Int"]["output"]>;
  new_version_number: Maybe<Scalars["Int"]["output"]>;
};

/** update columns of table "payroll_version_results" */
export type Payroll_Version_Results_Update_Column =
  /** column name */
  | "created_at"
  /** column name */
  | "created_by_user_id"
  /** column name */
  | "dates_deleted"
  /** column name */
  | "id"
  /** column name */
  | "message"
  /** column name */
  | "new_payroll_id"
  /** column name */
  | "new_version_number"
  /** column name */
  | "old_payroll_id";

export type Payroll_Version_Results_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Payroll_Version_Results_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Payroll_Version_Results_Set_Input>;
  /** filter the rows which have to be updated */
  where: Payroll_Version_Results_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Payroll_Version_Results_Var_Pop_Fields = {
  __typename: "payroll_version_results_var_pop_fields";
  dates_deleted: Maybe<Scalars["Float"]["output"]>;
  new_version_number: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate var_samp on columns */
export type Payroll_Version_Results_Var_Samp_Fields = {
  __typename: "payroll_version_results_var_samp_fields";
  dates_deleted: Maybe<Scalars["Float"]["output"]>;
  new_version_number: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate variance on columns */
export type Payroll_Version_Results_Variance_Fields = {
  __typename: "payroll_version_results_variance_fields";
  dates_deleted: Maybe<Scalars["Float"]["output"]>;
  new_version_number: Maybe<Scalars["Float"]["output"]>;
};

/** columns and relationships of "payrolls" */
export type Payrolls = {
  __typename: "payrolls";
  /** Backup consultant for this payroll */
  backup_consultant_user_id: Maybe<Scalars["uuid"]["output"]>;
  /** An array relationship */
  billing_items: Array<Billing_Items>;
  /** An aggregate relationship */
  billing_items_aggregate: Billing_Items_Aggregate;
  /** An object relationship */
  client: Clients;
  /** Reference to the client this payroll belongs to */
  client_id: Scalars["uuid"]["output"];
  /** Timestamp when the payroll was created */
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  created_by_user_id: Maybe<Scalars["uuid"]["output"]>;
  /** Reference to the payroll cycle */
  cycle_id: Scalars["uuid"]["output"];
  /** Reference to the payroll date type */
  date_type_id: Scalars["uuid"]["output"];
  /** Specific value for date calculation (e.g., day of month) */
  date_value: Maybe<Scalars["Int"]["output"]>;
  /** Number of employees in this payroll */
  employee_count: Maybe<Scalars["Int"]["output"]>;
  /** The date when the payroll went live in the system */
  go_live_date: Maybe<Scalars["date"]["output"]>;
  /** Unique identifier for the payroll */
  id: Scalars["uuid"]["output"];
  /** Manager overseeing this payroll */
  manager_user_id: Maybe<Scalars["uuid"]["output"]>;
  /** Name of the payroll */
  name: Scalars["String"]["output"];
  parent_payroll_id: Maybe<Scalars["uuid"]["output"]>;
  /** An object relationship */
  payroll: Maybe<Payrolls>;
  /** An object relationship */
  payroll_cycle: Payroll_Cycles;
  /** An object relationship */
  payroll_date_type: Payroll_Date_Types;
  /** An array relationship */
  payroll_dates: Array<Payroll_Dates>;
  /** An aggregate relationship */
  payroll_dates_aggregate: Payroll_Dates_Aggregate;
  /** External payroll system used for this client */
  payroll_system: Maybe<Scalars["String"]["output"]>;
  /** An array relationship */
  payrolls: Array<Payrolls>;
  /** An aggregate relationship */
  payrolls_aggregate: Payrolls_Aggregate;
  /** Primary consultant responsible for this payroll */
  primary_consultant_user_id: Maybe<Scalars["uuid"]["output"]>;
  /** Number of days before EFT that processing must complete */
  processing_days_before_eft: Scalars["Int"]["output"];
  /** Number of hours required to process this payroll */
  processing_time: Scalars["Int"]["output"];
  /** Current status of the payroll (Implementation, Active, Inactive) */
  status: Scalars["payroll_status"]["output"];
  superseded_date: Maybe<Scalars["date"]["output"]>;
  /** Timestamp when the payroll was last updated */
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
  /** An object relationship */
  userByBackupConsultantUserId: Maybe<Users>;
  /** An object relationship */
  userByManagerUserId: Maybe<Users>;
  /** An object relationship */
  userByPrimaryConsultantUserId: Maybe<Users>;
  version_number: Maybe<Scalars["Int"]["output"]>;
  version_reason: Maybe<Scalars["String"]["output"]>;
};

/** columns and relationships of "payrolls" */
export type PayrollsBilling_ItemsArgs = {
  distinct_on?: InputMaybe<Array<Billing_Items_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Billing_Items_Order_By>>;
  where?: InputMaybe<Billing_Items_Bool_Exp>;
};

/** columns and relationships of "payrolls" */
export type PayrollsBilling_Items_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Billing_Items_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Billing_Items_Order_By>>;
  where?: InputMaybe<Billing_Items_Bool_Exp>;
};

/** columns and relationships of "payrolls" */
export type PayrollsPayroll_DatesArgs = {
  distinct_on?: InputMaybe<Array<Payroll_Dates_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payroll_Dates_Order_By>>;
  where?: InputMaybe<Payroll_Dates_Bool_Exp>;
};

/** columns and relationships of "payrolls" */
export type PayrollsPayroll_Dates_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payroll_Dates_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payroll_Dates_Order_By>>;
  where?: InputMaybe<Payroll_Dates_Bool_Exp>;
};

/** columns and relationships of "payrolls" */
export type PayrollsPayrollsArgs = {
  distinct_on?: InputMaybe<Array<Payrolls_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payrolls_Order_By>>;
  where?: InputMaybe<Payrolls_Bool_Exp>;
};

/** columns and relationships of "payrolls" */
export type PayrollsPayrolls_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payrolls_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payrolls_Order_By>>;
  where?: InputMaybe<Payrolls_Bool_Exp>;
};

/** aggregated selection of "payrolls" */
export type Payrolls_Aggregate = {
  __typename: "payrolls_aggregate";
  aggregate: Maybe<Payrolls_Aggregate_Fields>;
  nodes: Array<Payrolls>;
};

export type Payrolls_Aggregate_Bool_Exp = {
  count?: InputMaybe<Payrolls_Aggregate_Bool_Exp_Count>;
};

export type Payrolls_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Payrolls_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Payrolls_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "payrolls" */
export type Payrolls_Aggregate_Fields = {
  __typename: "payrolls_aggregate_fields";
  avg: Maybe<Payrolls_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max: Maybe<Payrolls_Max_Fields>;
  min: Maybe<Payrolls_Min_Fields>;
  stddev: Maybe<Payrolls_Stddev_Fields>;
  stddev_pop: Maybe<Payrolls_Stddev_Pop_Fields>;
  stddev_samp: Maybe<Payrolls_Stddev_Samp_Fields>;
  sum: Maybe<Payrolls_Sum_Fields>;
  var_pop: Maybe<Payrolls_Var_Pop_Fields>;
  var_samp: Maybe<Payrolls_Var_Samp_Fields>;
  variance: Maybe<Payrolls_Variance_Fields>;
};

/** aggregate fields of "payrolls" */
export type Payrolls_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Payrolls_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "payrolls" */
export type Payrolls_Aggregate_Order_By = {
  avg?: InputMaybe<Payrolls_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Payrolls_Max_Order_By>;
  min?: InputMaybe<Payrolls_Min_Order_By>;
  stddev?: InputMaybe<Payrolls_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Payrolls_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Payrolls_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Payrolls_Sum_Order_By>;
  var_pop?: InputMaybe<Payrolls_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Payrolls_Var_Samp_Order_By>;
  variance?: InputMaybe<Payrolls_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "payrolls" */
export type Payrolls_Arr_Rel_Insert_Input = {
  data: Array<Payrolls_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Payrolls_On_Conflict>;
};

/** aggregate avg on columns */
export type Payrolls_Avg_Fields = {
  __typename: "payrolls_avg_fields";
  /** Specific value for date calculation (e.g., day of month) */
  date_value: Maybe<Scalars["Float"]["output"]>;
  /** Number of employees in this payroll */
  employee_count: Maybe<Scalars["Float"]["output"]>;
  /** Number of days before EFT that processing must complete */
  processing_days_before_eft: Maybe<Scalars["Float"]["output"]>;
  /** Number of hours required to process this payroll */
  processing_time: Maybe<Scalars["Float"]["output"]>;
  version_number: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "payrolls" */
export type Payrolls_Avg_Order_By = {
  /** Specific value for date calculation (e.g., day of month) */
  date_value?: InputMaybe<Order_By>;
  /** Number of employees in this payroll */
  employee_count?: InputMaybe<Order_By>;
  /** Number of days before EFT that processing must complete */
  processing_days_before_eft?: InputMaybe<Order_By>;
  /** Number of hours required to process this payroll */
  processing_time?: InputMaybe<Order_By>;
  version_number?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "payrolls". All fields are combined with a logical 'AND'. */
export type Payrolls_Bool_Exp = {
  _and?: InputMaybe<Array<Payrolls_Bool_Exp>>;
  _not?: InputMaybe<Payrolls_Bool_Exp>;
  _or?: InputMaybe<Array<Payrolls_Bool_Exp>>;
  backup_consultant_user_id?: InputMaybe<Uuid_Comparison_Exp>;
  billing_items?: InputMaybe<Billing_Items_Bool_Exp>;
  billing_items_aggregate?: InputMaybe<Billing_Items_Aggregate_Bool_Exp>;
  client?: InputMaybe<Clients_Bool_Exp>;
  client_id?: InputMaybe<Uuid_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  created_by_user_id?: InputMaybe<Uuid_Comparison_Exp>;
  cycle_id?: InputMaybe<Uuid_Comparison_Exp>;
  date_type_id?: InputMaybe<Uuid_Comparison_Exp>;
  date_value?: InputMaybe<Int_Comparison_Exp>;
  employee_count?: InputMaybe<Int_Comparison_Exp>;
  go_live_date?: InputMaybe<Date_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  manager_user_id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  parent_payroll_id?: InputMaybe<Uuid_Comparison_Exp>;
  payroll?: InputMaybe<Payrolls_Bool_Exp>;
  payroll_cycle?: InputMaybe<Payroll_Cycles_Bool_Exp>;
  payroll_date_type?: InputMaybe<Payroll_Date_Types_Bool_Exp>;
  payroll_dates?: InputMaybe<Payroll_Dates_Bool_Exp>;
  payroll_dates_aggregate?: InputMaybe<Payroll_Dates_Aggregate_Bool_Exp>;
  payroll_system?: InputMaybe<String_Comparison_Exp>;
  payrolls?: InputMaybe<Payrolls_Bool_Exp>;
  payrolls_aggregate?: InputMaybe<Payrolls_Aggregate_Bool_Exp>;
  primary_consultant_user_id?: InputMaybe<Uuid_Comparison_Exp>;
  processing_days_before_eft?: InputMaybe<Int_Comparison_Exp>;
  processing_time?: InputMaybe<Int_Comparison_Exp>;
  status?: InputMaybe<Payroll_Status_Comparison_Exp>;
  superseded_date?: InputMaybe<Date_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  userByBackupConsultantUserId?: InputMaybe<Users_Bool_Exp>;
  userByManagerUserId?: InputMaybe<Users_Bool_Exp>;
  userByPrimaryConsultantUserId?: InputMaybe<Users_Bool_Exp>;
  version_number?: InputMaybe<Int_Comparison_Exp>;
  version_reason?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "payrolls" */
export type Payrolls_Constraint =
  /** unique or primary key constraint on columns  */
  | "only_one_current_version_per_family"
  /** unique or primary key constraint on columns "id" */
  | "payrolls_pkey";

/** input type for incrementing numeric columns in table "payrolls" */
export type Payrolls_Inc_Input = {
  /** Specific value for date calculation (e.g., day of month) */
  date_value?: InputMaybe<Scalars["Int"]["input"]>;
  /** Number of employees in this payroll */
  employee_count?: InputMaybe<Scalars["Int"]["input"]>;
  /** Number of days before EFT that processing must complete */
  processing_days_before_eft?: InputMaybe<Scalars["Int"]["input"]>;
  /** Number of hours required to process this payroll */
  processing_time?: InputMaybe<Scalars["Int"]["input"]>;
  version_number?: InputMaybe<Scalars["Int"]["input"]>;
};

/** input type for inserting data into table "payrolls" */
export type Payrolls_Insert_Input = {
  /** Backup consultant for this payroll */
  backup_consultant_user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  billing_items?: InputMaybe<Billing_Items_Arr_Rel_Insert_Input>;
  client?: InputMaybe<Clients_Obj_Rel_Insert_Input>;
  /** Reference to the client this payroll belongs to */
  client_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Timestamp when the payroll was created */
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  created_by_user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Reference to the payroll cycle */
  cycle_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Reference to the payroll date type */
  date_type_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Specific value for date calculation (e.g., day of month) */
  date_value?: InputMaybe<Scalars["Int"]["input"]>;
  /** Number of employees in this payroll */
  employee_count?: InputMaybe<Scalars["Int"]["input"]>;
  /** The date when the payroll went live in the system */
  go_live_date?: InputMaybe<Scalars["date"]["input"]>;
  /** Unique identifier for the payroll */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Manager overseeing this payroll */
  manager_user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Name of the payroll */
  name?: InputMaybe<Scalars["String"]["input"]>;
  parent_payroll_id?: InputMaybe<Scalars["uuid"]["input"]>;
  payroll?: InputMaybe<Payrolls_Obj_Rel_Insert_Input>;
  payroll_cycle?: InputMaybe<Payroll_Cycles_Obj_Rel_Insert_Input>;
  payroll_date_type?: InputMaybe<Payroll_Date_Types_Obj_Rel_Insert_Input>;
  payroll_dates?: InputMaybe<Payroll_Dates_Arr_Rel_Insert_Input>;
  /** External payroll system used for this client */
  payroll_system?: InputMaybe<Scalars["String"]["input"]>;
  payrolls?: InputMaybe<Payrolls_Arr_Rel_Insert_Input>;
  /** Primary consultant responsible for this payroll */
  primary_consultant_user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Number of days before EFT that processing must complete */
  processing_days_before_eft?: InputMaybe<Scalars["Int"]["input"]>;
  /** Number of hours required to process this payroll */
  processing_time?: InputMaybe<Scalars["Int"]["input"]>;
  /** Current status of the payroll (Implementation, Active, Inactive) */
  status?: InputMaybe<Scalars["payroll_status"]["input"]>;
  superseded_date?: InputMaybe<Scalars["date"]["input"]>;
  /** Timestamp when the payroll was last updated */
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  userByBackupConsultantUserId?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  userByManagerUserId?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  userByPrimaryConsultantUserId?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  version_number?: InputMaybe<Scalars["Int"]["input"]>;
  version_reason?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregate max on columns */
export type Payrolls_Max_Fields = {
  __typename: "payrolls_max_fields";
  /** Backup consultant for this payroll */
  backup_consultant_user_id: Maybe<Scalars["uuid"]["output"]>;
  /** Reference to the client this payroll belongs to */
  client_id: Maybe<Scalars["uuid"]["output"]>;
  /** Timestamp when the payroll was created */
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  created_by_user_id: Maybe<Scalars["uuid"]["output"]>;
  /** Reference to the payroll cycle */
  cycle_id: Maybe<Scalars["uuid"]["output"]>;
  /** Reference to the payroll date type */
  date_type_id: Maybe<Scalars["uuid"]["output"]>;
  /** Specific value for date calculation (e.g., day of month) */
  date_value: Maybe<Scalars["Int"]["output"]>;
  /** Number of employees in this payroll */
  employee_count: Maybe<Scalars["Int"]["output"]>;
  /** The date when the payroll went live in the system */
  go_live_date: Maybe<Scalars["date"]["output"]>;
  /** Unique identifier for the payroll */
  id: Maybe<Scalars["uuid"]["output"]>;
  /** Manager overseeing this payroll */
  manager_user_id: Maybe<Scalars["uuid"]["output"]>;
  /** Name of the payroll */
  name: Maybe<Scalars["String"]["output"]>;
  parent_payroll_id: Maybe<Scalars["uuid"]["output"]>;
  /** External payroll system used for this client */
  payroll_system: Maybe<Scalars["String"]["output"]>;
  /** Primary consultant responsible for this payroll */
  primary_consultant_user_id: Maybe<Scalars["uuid"]["output"]>;
  /** Number of days before EFT that processing must complete */
  processing_days_before_eft: Maybe<Scalars["Int"]["output"]>;
  /** Number of hours required to process this payroll */
  processing_time: Maybe<Scalars["Int"]["output"]>;
  /** Current status of the payroll (Implementation, Active, Inactive) */
  status: Maybe<Scalars["payroll_status"]["output"]>;
  superseded_date: Maybe<Scalars["date"]["output"]>;
  /** Timestamp when the payroll was last updated */
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
  version_number: Maybe<Scalars["Int"]["output"]>;
  version_reason: Maybe<Scalars["String"]["output"]>;
};

/** order by max() on columns of table "payrolls" */
export type Payrolls_Max_Order_By = {
  /** Backup consultant for this payroll */
  backup_consultant_user_id?: InputMaybe<Order_By>;
  /** Reference to the client this payroll belongs to */
  client_id?: InputMaybe<Order_By>;
  /** Timestamp when the payroll was created */
  created_at?: InputMaybe<Order_By>;
  created_by_user_id?: InputMaybe<Order_By>;
  /** Reference to the payroll cycle */
  cycle_id?: InputMaybe<Order_By>;
  /** Reference to the payroll date type */
  date_type_id?: InputMaybe<Order_By>;
  /** Specific value for date calculation (e.g., day of month) */
  date_value?: InputMaybe<Order_By>;
  /** Number of employees in this payroll */
  employee_count?: InputMaybe<Order_By>;
  /** The date when the payroll went live in the system */
  go_live_date?: InputMaybe<Order_By>;
  /** Unique identifier for the payroll */
  id?: InputMaybe<Order_By>;
  /** Manager overseeing this payroll */
  manager_user_id?: InputMaybe<Order_By>;
  /** Name of the payroll */
  name?: InputMaybe<Order_By>;
  parent_payroll_id?: InputMaybe<Order_By>;
  /** External payroll system used for this client */
  payroll_system?: InputMaybe<Order_By>;
  /** Primary consultant responsible for this payroll */
  primary_consultant_user_id?: InputMaybe<Order_By>;
  /** Number of days before EFT that processing must complete */
  processing_days_before_eft?: InputMaybe<Order_By>;
  /** Number of hours required to process this payroll */
  processing_time?: InputMaybe<Order_By>;
  /** Current status of the payroll (Implementation, Active, Inactive) */
  status?: InputMaybe<Order_By>;
  superseded_date?: InputMaybe<Order_By>;
  /** Timestamp when the payroll was last updated */
  updated_at?: InputMaybe<Order_By>;
  version_number?: InputMaybe<Order_By>;
  version_reason?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Payrolls_Min_Fields = {
  __typename: "payrolls_min_fields";
  /** Backup consultant for this payroll */
  backup_consultant_user_id: Maybe<Scalars["uuid"]["output"]>;
  /** Reference to the client this payroll belongs to */
  client_id: Maybe<Scalars["uuid"]["output"]>;
  /** Timestamp when the payroll was created */
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  created_by_user_id: Maybe<Scalars["uuid"]["output"]>;
  /** Reference to the payroll cycle */
  cycle_id: Maybe<Scalars["uuid"]["output"]>;
  /** Reference to the payroll date type */
  date_type_id: Maybe<Scalars["uuid"]["output"]>;
  /** Specific value for date calculation (e.g., day of month) */
  date_value: Maybe<Scalars["Int"]["output"]>;
  /** Number of employees in this payroll */
  employee_count: Maybe<Scalars["Int"]["output"]>;
  /** The date when the payroll went live in the system */
  go_live_date: Maybe<Scalars["date"]["output"]>;
  /** Unique identifier for the payroll */
  id: Maybe<Scalars["uuid"]["output"]>;
  /** Manager overseeing this payroll */
  manager_user_id: Maybe<Scalars["uuid"]["output"]>;
  /** Name of the payroll */
  name: Maybe<Scalars["String"]["output"]>;
  parent_payroll_id: Maybe<Scalars["uuid"]["output"]>;
  /** External payroll system used for this client */
  payroll_system: Maybe<Scalars["String"]["output"]>;
  /** Primary consultant responsible for this payroll */
  primary_consultant_user_id: Maybe<Scalars["uuid"]["output"]>;
  /** Number of days before EFT that processing must complete */
  processing_days_before_eft: Maybe<Scalars["Int"]["output"]>;
  /** Number of hours required to process this payroll */
  processing_time: Maybe<Scalars["Int"]["output"]>;
  /** Current status of the payroll (Implementation, Active, Inactive) */
  status: Maybe<Scalars["payroll_status"]["output"]>;
  superseded_date: Maybe<Scalars["date"]["output"]>;
  /** Timestamp when the payroll was last updated */
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
  version_number: Maybe<Scalars["Int"]["output"]>;
  version_reason: Maybe<Scalars["String"]["output"]>;
};

/** order by min() on columns of table "payrolls" */
export type Payrolls_Min_Order_By = {
  /** Backup consultant for this payroll */
  backup_consultant_user_id?: InputMaybe<Order_By>;
  /** Reference to the client this payroll belongs to */
  client_id?: InputMaybe<Order_By>;
  /** Timestamp when the payroll was created */
  created_at?: InputMaybe<Order_By>;
  created_by_user_id?: InputMaybe<Order_By>;
  /** Reference to the payroll cycle */
  cycle_id?: InputMaybe<Order_By>;
  /** Reference to the payroll date type */
  date_type_id?: InputMaybe<Order_By>;
  /** Specific value for date calculation (e.g., day of month) */
  date_value?: InputMaybe<Order_By>;
  /** Number of employees in this payroll */
  employee_count?: InputMaybe<Order_By>;
  /** The date when the payroll went live in the system */
  go_live_date?: InputMaybe<Order_By>;
  /** Unique identifier for the payroll */
  id?: InputMaybe<Order_By>;
  /** Manager overseeing this payroll */
  manager_user_id?: InputMaybe<Order_By>;
  /** Name of the payroll */
  name?: InputMaybe<Order_By>;
  parent_payroll_id?: InputMaybe<Order_By>;
  /** External payroll system used for this client */
  payroll_system?: InputMaybe<Order_By>;
  /** Primary consultant responsible for this payroll */
  primary_consultant_user_id?: InputMaybe<Order_By>;
  /** Number of days before EFT that processing must complete */
  processing_days_before_eft?: InputMaybe<Order_By>;
  /** Number of hours required to process this payroll */
  processing_time?: InputMaybe<Order_By>;
  /** Current status of the payroll (Implementation, Active, Inactive) */
  status?: InputMaybe<Order_By>;
  superseded_date?: InputMaybe<Order_By>;
  /** Timestamp when the payroll was last updated */
  updated_at?: InputMaybe<Order_By>;
  version_number?: InputMaybe<Order_By>;
  version_reason?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "payrolls" */
export type Payrolls_Mutation_Response = {
  __typename: "payrolls_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Payrolls>;
};

/** input type for inserting object relation for remote table "payrolls" */
export type Payrolls_Obj_Rel_Insert_Input = {
  data: Payrolls_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Payrolls_On_Conflict>;
};

/** on_conflict condition type for table "payrolls" */
export type Payrolls_On_Conflict = {
  constraint: Payrolls_Constraint;
  update_columns?: Array<Payrolls_Update_Column>;
  where?: InputMaybe<Payrolls_Bool_Exp>;
};

/** Ordering options when selecting data from "payrolls". */
export type Payrolls_Order_By = {
  backup_consultant_user_id?: InputMaybe<Order_By>;
  billing_items_aggregate?: InputMaybe<Billing_Items_Aggregate_Order_By>;
  client?: InputMaybe<Clients_Order_By>;
  client_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  created_by_user_id?: InputMaybe<Order_By>;
  cycle_id?: InputMaybe<Order_By>;
  date_type_id?: InputMaybe<Order_By>;
  date_value?: InputMaybe<Order_By>;
  employee_count?: InputMaybe<Order_By>;
  go_live_date?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  manager_user_id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  parent_payroll_id?: InputMaybe<Order_By>;
  payroll?: InputMaybe<Payrolls_Order_By>;
  payroll_cycle?: InputMaybe<Payroll_Cycles_Order_By>;
  payroll_date_type?: InputMaybe<Payroll_Date_Types_Order_By>;
  payroll_dates_aggregate?: InputMaybe<Payroll_Dates_Aggregate_Order_By>;
  payroll_system?: InputMaybe<Order_By>;
  payrolls_aggregate?: InputMaybe<Payrolls_Aggregate_Order_By>;
  primary_consultant_user_id?: InputMaybe<Order_By>;
  processing_days_before_eft?: InputMaybe<Order_By>;
  processing_time?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  superseded_date?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  userByBackupConsultantUserId?: InputMaybe<Users_Order_By>;
  userByManagerUserId?: InputMaybe<Users_Order_By>;
  userByPrimaryConsultantUserId?: InputMaybe<Users_Order_By>;
  version_number?: InputMaybe<Order_By>;
  version_reason?: InputMaybe<Order_By>;
};

/** primary key columns input for table: payrolls */
export type Payrolls_Pk_Columns_Input = {
  /** Unique identifier for the payroll */
  id: Scalars["uuid"]["input"];
};

/** select columns of table "payrolls" */
export type Payrolls_Select_Column =
  /** column name */
  | "backup_consultant_user_id"
  /** column name */
  | "client_id"
  /** column name */
  | "created_at"
  /** column name */
  | "created_by_user_id"
  /** column name */
  | "cycle_id"
  /** column name */
  | "date_type_id"
  /** column name */
  | "date_value"
  /** column name */
  | "employee_count"
  /** column name */
  | "go_live_date"
  /** column name */
  | "id"
  /** column name */
  | "manager_user_id"
  /** column name */
  | "name"
  /** column name */
  | "parent_payroll_id"
  /** column name */
  | "payroll_system"
  /** column name */
  | "primary_consultant_user_id"
  /** column name */
  | "processing_days_before_eft"
  /** column name */
  | "processing_time"
  /** column name */
  | "status"
  /** column name */
  | "superseded_date"
  /** column name */
  | "updated_at"
  /** column name */
  | "version_number"
  /** column name */
  | "version_reason";

/** input type for updating data in table "payrolls" */
export type Payrolls_Set_Input = {
  /** Backup consultant for this payroll */
  backup_consultant_user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Reference to the client this payroll belongs to */
  client_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Timestamp when the payroll was created */
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  created_by_user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Reference to the payroll cycle */
  cycle_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Reference to the payroll date type */
  date_type_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Specific value for date calculation (e.g., day of month) */
  date_value?: InputMaybe<Scalars["Int"]["input"]>;
  /** Number of employees in this payroll */
  employee_count?: InputMaybe<Scalars["Int"]["input"]>;
  /** The date when the payroll went live in the system */
  go_live_date?: InputMaybe<Scalars["date"]["input"]>;
  /** Unique identifier for the payroll */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Manager overseeing this payroll */
  manager_user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Name of the payroll */
  name?: InputMaybe<Scalars["String"]["input"]>;
  parent_payroll_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** External payroll system used for this client */
  payroll_system?: InputMaybe<Scalars["String"]["input"]>;
  /** Primary consultant responsible for this payroll */
  primary_consultant_user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Number of days before EFT that processing must complete */
  processing_days_before_eft?: InputMaybe<Scalars["Int"]["input"]>;
  /** Number of hours required to process this payroll */
  processing_time?: InputMaybe<Scalars["Int"]["input"]>;
  /** Current status of the payroll (Implementation, Active, Inactive) */
  status?: InputMaybe<Scalars["payroll_status"]["input"]>;
  superseded_date?: InputMaybe<Scalars["date"]["input"]>;
  /** Timestamp when the payroll was last updated */
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  version_number?: InputMaybe<Scalars["Int"]["input"]>;
  version_reason?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregate stddev on columns */
export type Payrolls_Stddev_Fields = {
  __typename: "payrolls_stddev_fields";
  /** Specific value for date calculation (e.g., day of month) */
  date_value: Maybe<Scalars["Float"]["output"]>;
  /** Number of employees in this payroll */
  employee_count: Maybe<Scalars["Float"]["output"]>;
  /** Number of days before EFT that processing must complete */
  processing_days_before_eft: Maybe<Scalars["Float"]["output"]>;
  /** Number of hours required to process this payroll */
  processing_time: Maybe<Scalars["Float"]["output"]>;
  version_number: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "payrolls" */
export type Payrolls_Stddev_Order_By = {
  /** Specific value for date calculation (e.g., day of month) */
  date_value?: InputMaybe<Order_By>;
  /** Number of employees in this payroll */
  employee_count?: InputMaybe<Order_By>;
  /** Number of days before EFT that processing must complete */
  processing_days_before_eft?: InputMaybe<Order_By>;
  /** Number of hours required to process this payroll */
  processing_time?: InputMaybe<Order_By>;
  version_number?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Payrolls_Stddev_Pop_Fields = {
  __typename: "payrolls_stddev_pop_fields";
  /** Specific value for date calculation (e.g., day of month) */
  date_value: Maybe<Scalars["Float"]["output"]>;
  /** Number of employees in this payroll */
  employee_count: Maybe<Scalars["Float"]["output"]>;
  /** Number of days before EFT that processing must complete */
  processing_days_before_eft: Maybe<Scalars["Float"]["output"]>;
  /** Number of hours required to process this payroll */
  processing_time: Maybe<Scalars["Float"]["output"]>;
  version_number: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "payrolls" */
export type Payrolls_Stddev_Pop_Order_By = {
  /** Specific value for date calculation (e.g., day of month) */
  date_value?: InputMaybe<Order_By>;
  /** Number of employees in this payroll */
  employee_count?: InputMaybe<Order_By>;
  /** Number of days before EFT that processing must complete */
  processing_days_before_eft?: InputMaybe<Order_By>;
  /** Number of hours required to process this payroll */
  processing_time?: InputMaybe<Order_By>;
  version_number?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Payrolls_Stddev_Samp_Fields = {
  __typename: "payrolls_stddev_samp_fields";
  /** Specific value for date calculation (e.g., day of month) */
  date_value: Maybe<Scalars["Float"]["output"]>;
  /** Number of employees in this payroll */
  employee_count: Maybe<Scalars["Float"]["output"]>;
  /** Number of days before EFT that processing must complete */
  processing_days_before_eft: Maybe<Scalars["Float"]["output"]>;
  /** Number of hours required to process this payroll */
  processing_time: Maybe<Scalars["Float"]["output"]>;
  version_number: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "payrolls" */
export type Payrolls_Stddev_Samp_Order_By = {
  /** Specific value for date calculation (e.g., day of month) */
  date_value?: InputMaybe<Order_By>;
  /** Number of employees in this payroll */
  employee_count?: InputMaybe<Order_By>;
  /** Number of days before EFT that processing must complete */
  processing_days_before_eft?: InputMaybe<Order_By>;
  /** Number of hours required to process this payroll */
  processing_time?: InputMaybe<Order_By>;
  version_number?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "payrolls" */
export type Payrolls_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Payrolls_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Payrolls_Stream_Cursor_Value_Input = {
  /** Backup consultant for this payroll */
  backup_consultant_user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Reference to the client this payroll belongs to */
  client_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Timestamp when the payroll was created */
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  created_by_user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Reference to the payroll cycle */
  cycle_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Reference to the payroll date type */
  date_type_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Specific value for date calculation (e.g., day of month) */
  date_value?: InputMaybe<Scalars["Int"]["input"]>;
  /** Number of employees in this payroll */
  employee_count?: InputMaybe<Scalars["Int"]["input"]>;
  /** The date when the payroll went live in the system */
  go_live_date?: InputMaybe<Scalars["date"]["input"]>;
  /** Unique identifier for the payroll */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Manager overseeing this payroll */
  manager_user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Name of the payroll */
  name?: InputMaybe<Scalars["String"]["input"]>;
  parent_payroll_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** External payroll system used for this client */
  payroll_system?: InputMaybe<Scalars["String"]["input"]>;
  /** Primary consultant responsible for this payroll */
  primary_consultant_user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Number of days before EFT that processing must complete */
  processing_days_before_eft?: InputMaybe<Scalars["Int"]["input"]>;
  /** Number of hours required to process this payroll */
  processing_time?: InputMaybe<Scalars["Int"]["input"]>;
  /** Current status of the payroll (Implementation, Active, Inactive) */
  status?: InputMaybe<Scalars["payroll_status"]["input"]>;
  superseded_date?: InputMaybe<Scalars["date"]["input"]>;
  /** Timestamp when the payroll was last updated */
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  version_number?: InputMaybe<Scalars["Int"]["input"]>;
  version_reason?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregate sum on columns */
export type Payrolls_Sum_Fields = {
  __typename: "payrolls_sum_fields";
  /** Specific value for date calculation (e.g., day of month) */
  date_value: Maybe<Scalars["Int"]["output"]>;
  /** Number of employees in this payroll */
  employee_count: Maybe<Scalars["Int"]["output"]>;
  /** Number of days before EFT that processing must complete */
  processing_days_before_eft: Maybe<Scalars["Int"]["output"]>;
  /** Number of hours required to process this payroll */
  processing_time: Maybe<Scalars["Int"]["output"]>;
  version_number: Maybe<Scalars["Int"]["output"]>;
};

/** order by sum() on columns of table "payrolls" */
export type Payrolls_Sum_Order_By = {
  /** Specific value for date calculation (e.g., day of month) */
  date_value?: InputMaybe<Order_By>;
  /** Number of employees in this payroll */
  employee_count?: InputMaybe<Order_By>;
  /** Number of days before EFT that processing must complete */
  processing_days_before_eft?: InputMaybe<Order_By>;
  /** Number of hours required to process this payroll */
  processing_time?: InputMaybe<Order_By>;
  version_number?: InputMaybe<Order_By>;
};

/** update columns of table "payrolls" */
export type Payrolls_Update_Column =
  /** column name */
  | "backup_consultant_user_id"
  /** column name */
  | "client_id"
  /** column name */
  | "created_at"
  /** column name */
  | "created_by_user_id"
  /** column name */
  | "cycle_id"
  /** column name */
  | "date_type_id"
  /** column name */
  | "date_value"
  /** column name */
  | "employee_count"
  /** column name */
  | "go_live_date"
  /** column name */
  | "id"
  /** column name */
  | "manager_user_id"
  /** column name */
  | "name"
  /** column name */
  | "parent_payroll_id"
  /** column name */
  | "payroll_system"
  /** column name */
  | "primary_consultant_user_id"
  /** column name */
  | "processing_days_before_eft"
  /** column name */
  | "processing_time"
  /** column name */
  | "status"
  /** column name */
  | "superseded_date"
  /** column name */
  | "updated_at"
  /** column name */
  | "version_number"
  /** column name */
  | "version_reason";

export type Payrolls_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Payrolls_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Payrolls_Set_Input>;
  /** filter the rows which have to be updated */
  where: Payrolls_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Payrolls_Var_Pop_Fields = {
  __typename: "payrolls_var_pop_fields";
  /** Specific value for date calculation (e.g., day of month) */
  date_value: Maybe<Scalars["Float"]["output"]>;
  /** Number of employees in this payroll */
  employee_count: Maybe<Scalars["Float"]["output"]>;
  /** Number of days before EFT that processing must complete */
  processing_days_before_eft: Maybe<Scalars["Float"]["output"]>;
  /** Number of hours required to process this payroll */
  processing_time: Maybe<Scalars["Float"]["output"]>;
  version_number: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "payrolls" */
export type Payrolls_Var_Pop_Order_By = {
  /** Specific value for date calculation (e.g., day of month) */
  date_value?: InputMaybe<Order_By>;
  /** Number of employees in this payroll */
  employee_count?: InputMaybe<Order_By>;
  /** Number of days before EFT that processing must complete */
  processing_days_before_eft?: InputMaybe<Order_By>;
  /** Number of hours required to process this payroll */
  processing_time?: InputMaybe<Order_By>;
  version_number?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Payrolls_Var_Samp_Fields = {
  __typename: "payrolls_var_samp_fields";
  /** Specific value for date calculation (e.g., day of month) */
  date_value: Maybe<Scalars["Float"]["output"]>;
  /** Number of employees in this payroll */
  employee_count: Maybe<Scalars["Float"]["output"]>;
  /** Number of days before EFT that processing must complete */
  processing_days_before_eft: Maybe<Scalars["Float"]["output"]>;
  /** Number of hours required to process this payroll */
  processing_time: Maybe<Scalars["Float"]["output"]>;
  version_number: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "payrolls" */
export type Payrolls_Var_Samp_Order_By = {
  /** Specific value for date calculation (e.g., day of month) */
  date_value?: InputMaybe<Order_By>;
  /** Number of employees in this payroll */
  employee_count?: InputMaybe<Order_By>;
  /** Number of days before EFT that processing must complete */
  processing_days_before_eft?: InputMaybe<Order_By>;
  /** Number of hours required to process this payroll */
  processing_time?: InputMaybe<Order_By>;
  version_number?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Payrolls_Variance_Fields = {
  __typename: "payrolls_variance_fields";
  /** Specific value for date calculation (e.g., day of month) */
  date_value: Maybe<Scalars["Float"]["output"]>;
  /** Number of employees in this payroll */
  employee_count: Maybe<Scalars["Float"]["output"]>;
  /** Number of days before EFT that processing must complete */
  processing_days_before_eft: Maybe<Scalars["Float"]["output"]>;
  /** Number of hours required to process this payroll */
  processing_time: Maybe<Scalars["Float"]["output"]>;
  version_number: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "payrolls" */
export type Payrolls_Variance_Order_By = {
  /** Specific value for date calculation (e.g., day of month) */
  date_value?: InputMaybe<Order_By>;
  /** Number of employees in this payroll */
  employee_count?: InputMaybe<Order_By>;
  /** Number of days before EFT that processing must complete */
  processing_days_before_eft?: InputMaybe<Order_By>;
  /** Number of hours required to process this payroll */
  processing_time?: InputMaybe<Order_By>;
  version_number?: InputMaybe<Order_By>;
};

/** Boolean expression to compare columns of type "permission_action". All fields are combined with logical 'AND'. */
export type Permission_Action_Comparison_Exp = {
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

/** columns and relationships of "permissions" */
export type Permissions = {
  __typename: "permissions";
  action: Scalars["permission_action"]["output"];
  created_at: Scalars["timestamptz"]["output"];
  description: Maybe<Scalars["String"]["output"]>;
  id: Scalars["uuid"]["output"];
  legacy_permission_name: Maybe<Scalars["String"]["output"]>;
  /** An object relationship */
  resource: Resources;
  resource_id: Scalars["uuid"]["output"];
  /** An array relationship */
  role_permissions: Array<Role_Permissions>;
  /** An aggregate relationship */
  role_permissions_aggregate: Role_Permissions_Aggregate;
  updated_at: Scalars["timestamptz"]["output"];
};

/** columns and relationships of "permissions" */
export type PermissionsRole_PermissionsArgs = {
  distinct_on?: InputMaybe<Array<Role_Permissions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Role_Permissions_Order_By>>;
  where?: InputMaybe<Role_Permissions_Bool_Exp>;
};

/** columns and relationships of "permissions" */
export type PermissionsRole_Permissions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Role_Permissions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Role_Permissions_Order_By>>;
  where?: InputMaybe<Role_Permissions_Bool_Exp>;
};

/** aggregated selection of "permissions" */
export type Permissions_Aggregate = {
  __typename: "permissions_aggregate";
  aggregate: Maybe<Permissions_Aggregate_Fields>;
  nodes: Array<Permissions>;
};

export type Permissions_Aggregate_Bool_Exp = {
  count?: InputMaybe<Permissions_Aggregate_Bool_Exp_Count>;
};

export type Permissions_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Permissions_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Permissions_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "permissions" */
export type Permissions_Aggregate_Fields = {
  __typename: "permissions_aggregate_fields";
  count: Scalars["Int"]["output"];
  max: Maybe<Permissions_Max_Fields>;
  min: Maybe<Permissions_Min_Fields>;
};

/** aggregate fields of "permissions" */
export type Permissions_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Permissions_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "permissions" */
export type Permissions_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Permissions_Max_Order_By>;
  min?: InputMaybe<Permissions_Min_Order_By>;
};

/** input type for inserting array relation for remote table "permissions" */
export type Permissions_Arr_Rel_Insert_Input = {
  data: Array<Permissions_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Permissions_On_Conflict>;
};

/** Boolean expression to filter rows from the table "permissions". All fields are combined with a logical 'AND'. */
export type Permissions_Bool_Exp = {
  _and?: InputMaybe<Array<Permissions_Bool_Exp>>;
  _not?: InputMaybe<Permissions_Bool_Exp>;
  _or?: InputMaybe<Array<Permissions_Bool_Exp>>;
  action?: InputMaybe<Permission_Action_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  legacy_permission_name?: InputMaybe<String_Comparison_Exp>;
  resource?: InputMaybe<Resources_Bool_Exp>;
  resource_id?: InputMaybe<Uuid_Comparison_Exp>;
  role_permissions?: InputMaybe<Role_Permissions_Bool_Exp>;
  role_permissions_aggregate?: InputMaybe<Role_Permissions_Aggregate_Bool_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "permissions" */
export type Permissions_Constraint =
  /** unique or primary key constraint on columns "id" */
  | "permissions_pkey"
  /** unique or primary key constraint on columns "action", "resource_id" */
  | "permissions_resource_id_action_key";

/** input type for inserting data into table "permissions" */
export type Permissions_Insert_Input = {
  action?: InputMaybe<Scalars["permission_action"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  legacy_permission_name?: InputMaybe<Scalars["String"]["input"]>;
  resource?: InputMaybe<Resources_Obj_Rel_Insert_Input>;
  resource_id?: InputMaybe<Scalars["uuid"]["input"]>;
  role_permissions?: InputMaybe<Role_Permissions_Arr_Rel_Insert_Input>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** aggregate max on columns */
export type Permissions_Max_Fields = {
  __typename: "permissions_max_fields";
  action: Maybe<Scalars["permission_action"]["output"]>;
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  description: Maybe<Scalars["String"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  legacy_permission_name: Maybe<Scalars["String"]["output"]>;
  resource_id: Maybe<Scalars["uuid"]["output"]>;
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
};

/** order by max() on columns of table "permissions" */
export type Permissions_Max_Order_By = {
  action?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  legacy_permission_name?: InputMaybe<Order_By>;
  resource_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Permissions_Min_Fields = {
  __typename: "permissions_min_fields";
  action: Maybe<Scalars["permission_action"]["output"]>;
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  description: Maybe<Scalars["String"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  legacy_permission_name: Maybe<Scalars["String"]["output"]>;
  resource_id: Maybe<Scalars["uuid"]["output"]>;
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
};

/** order by min() on columns of table "permissions" */
export type Permissions_Min_Order_By = {
  action?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  legacy_permission_name?: InputMaybe<Order_By>;
  resource_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "permissions" */
export type Permissions_Mutation_Response = {
  __typename: "permissions_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Permissions>;
};

/** input type for inserting object relation for remote table "permissions" */
export type Permissions_Obj_Rel_Insert_Input = {
  data: Permissions_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Permissions_On_Conflict>;
};

/** on_conflict condition type for table "permissions" */
export type Permissions_On_Conflict = {
  constraint: Permissions_Constraint;
  update_columns?: Array<Permissions_Update_Column>;
  where?: InputMaybe<Permissions_Bool_Exp>;
};

/** Ordering options when selecting data from "permissions". */
export type Permissions_Order_By = {
  action?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  legacy_permission_name?: InputMaybe<Order_By>;
  resource?: InputMaybe<Resources_Order_By>;
  resource_id?: InputMaybe<Order_By>;
  role_permissions_aggregate?: InputMaybe<Role_Permissions_Aggregate_Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: permissions */
export type Permissions_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "permissions" */
export type Permissions_Select_Column =
  /** column name */
  | "action"
  /** column name */
  | "created_at"
  /** column name */
  | "description"
  /** column name */
  | "id"
  /** column name */
  | "legacy_permission_name"
  /** column name */
  | "resource_id"
  /** column name */
  | "updated_at";

/** input type for updating data in table "permissions" */
export type Permissions_Set_Input = {
  action?: InputMaybe<Scalars["permission_action"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  legacy_permission_name?: InputMaybe<Scalars["String"]["input"]>;
  resource_id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** Streaming cursor of the table "permissions" */
export type Permissions_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Permissions_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Permissions_Stream_Cursor_Value_Input = {
  action?: InputMaybe<Scalars["permission_action"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  legacy_permission_name?: InputMaybe<Scalars["String"]["input"]>;
  resource_id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** update columns of table "permissions" */
export type Permissions_Update_Column =
  /** column name */
  | "action"
  /** column name */
  | "created_at"
  /** column name */
  | "description"
  /** column name */
  | "id"
  /** column name */
  | "legacy_permission_name"
  /** column name */
  | "resource_id"
  /** column name */
  | "updated_at";

export type Permissions_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Permissions_Set_Input>;
  /** filter the rows which have to be updated */
  where: Permissions_Bool_Exp;
};

export type Query_Root = {
  __typename: "query_root";
  /** query _Entity union */
  _entities: Maybe<_Entity>;
  _service: _Service;
  /** An array relationship */
  adjustment_rules: Array<Adjustment_Rules>;
  /** An aggregate relationship */
  adjustment_rules_aggregate: Adjustment_Rules_Aggregate;
  /** fetch data from the table: "adjustment_rules" using primary key columns */
  adjustment_rules_by_pk: Maybe<Adjustment_Rules>;
  /** fetch data from the table: "app_settings" */
  app_settings: Array<App_Settings>;
  /** fetch aggregated fields from the table: "app_settings" */
  app_settings_aggregate: App_Settings_Aggregate;
  /** fetch data from the table: "app_settings" using primary key columns */
  app_settings_by_pk: Maybe<App_Settings>;
  /** fetch data from the table: "billing_event_log" */
  billing_event_log: Array<Billing_Event_Log>;
  /** fetch aggregated fields from the table: "billing_event_log" */
  billing_event_log_aggregate: Billing_Event_Log_Aggregate;
  /** fetch data from the table: "billing_event_log" using primary key columns */
  billing_event_log_by_pk: Maybe<Billing_Event_Log>;
  /** fetch data from the table: "billing_invoice" */
  billing_invoice: Array<Billing_Invoice>;
  /** fetch aggregated fields from the table: "billing_invoice" */
  billing_invoice_aggregate: Billing_Invoice_Aggregate;
  /** fetch data from the table: "billing_invoice" using primary key columns */
  billing_invoice_by_pk: Maybe<Billing_Invoice>;
  /** fetch data from the table: "billing_invoice_item" */
  billing_invoice_item: Array<Billing_Invoice_Item>;
  /** fetch aggregated fields from the table: "billing_invoice_item" */
  billing_invoice_item_aggregate: Billing_Invoice_Item_Aggregate;
  /** fetch data from the table: "billing_invoice_item" using primary key columns */
  billing_invoice_item_by_pk: Maybe<Billing_Invoice_Item>;
  /** fetch data from the table: "billing_invoices" */
  billing_invoices: Array<Billing_Invoices>;
  /** fetch aggregated fields from the table: "billing_invoices" */
  billing_invoices_aggregate: Billing_Invoices_Aggregate;
  /** fetch data from the table: "billing_invoices" using primary key columns */
  billing_invoices_by_pk: Maybe<Billing_Invoices>;
  /** An array relationship */
  billing_items: Array<Billing_Items>;
  /** An aggregate relationship */
  billing_items_aggregate: Billing_Items_Aggregate;
  /** fetch data from the table: "billing_items" using primary key columns */
  billing_items_by_pk: Maybe<Billing_Items>;
  /** fetch data from the table: "billing_plan" */
  billing_plan: Array<Billing_Plan>;
  /** fetch aggregated fields from the table: "billing_plan" */
  billing_plan_aggregate: Billing_Plan_Aggregate;
  /** fetch data from the table: "billing_plan" using primary key columns */
  billing_plan_by_pk: Maybe<Billing_Plan>;
  /** fetch data from the table: "client_billing_assignment" */
  client_billing_assignment: Array<Client_Billing_Assignment>;
  /** fetch aggregated fields from the table: "client_billing_assignment" */
  client_billing_assignment_aggregate: Client_Billing_Assignment_Aggregate;
  /** fetch data from the table: "client_billing_assignment" using primary key columns */
  client_billing_assignment_by_pk: Maybe<Client_Billing_Assignment>;
  /** An array relationship */
  client_external_systems: Array<Client_External_Systems>;
  /** An aggregate relationship */
  client_external_systems_aggregate: Client_External_Systems_Aggregate;
  /** fetch data from the table: "client_external_systems" using primary key columns */
  client_external_systems_by_pk: Maybe<Client_External_Systems>;
  /** fetch data from the table: "clients" */
  clients: Array<Clients>;
  /** fetch aggregated fields from the table: "clients" */
  clients_aggregate: Clients_Aggregate;
  /** fetch data from the table: "clients" using primary key columns */
  clients_by_pk: Maybe<Clients>;
  /** execute function "create_payroll_version" which returns "payroll_version_results" */
  create_payroll_version: Array<Payroll_Version_Results>;
  /** execute function "create_payroll_version" and query aggregates on result of table type "payroll_version_results" */
  create_payroll_version_aggregate: Payroll_Version_Results_Aggregate;
  /** fetch data from the table: "current_payrolls" */
  current_payrolls: Array<Current_Payrolls>;
  /** fetch aggregated fields from the table: "current_payrolls" */
  current_payrolls_aggregate: Current_Payrolls_Aggregate;
  /** fetch data from the table: "external_systems" */
  external_systems: Array<External_Systems>;
  /** fetch aggregated fields from the table: "external_systems" */
  external_systems_aggregate: External_Systems_Aggregate;
  /** fetch data from the table: "external_systems" using primary key columns */
  external_systems_by_pk: Maybe<External_Systems>;
  /** fetch data from the table: "feature_flags" */
  feature_flags: Array<Feature_Flags>;
  /** fetch aggregated fields from the table: "feature_flags" */
  feature_flags_aggregate: Feature_Flags_Aggregate;
  /** fetch data from the table: "feature_flags" using primary key columns */
  feature_flags_by_pk: Maybe<Feature_Flags>;
  /** execute function "generate_payroll_dates" which returns "payroll_dates" */
  generate_payroll_dates: Array<Payroll_Dates>;
  /** execute function "generate_payroll_dates" and query aggregates on result of table type "payroll_dates" */
  generate_payroll_dates_aggregate: Payroll_Dates_Aggregate;
  /** fetch data from the table: "holidays" */
  holidays: Array<Holidays>;
  /** fetch aggregated fields from the table: "holidays" */
  holidays_aggregate: Holidays_Aggregate;
  /** fetch data from the table: "holidays" using primary key columns */
  holidays_by_pk: Maybe<Holidays>;
  /** fetch data from the table: "latest_payroll_version_results" */
  latest_payroll_version_results: Array<Latest_Payroll_Version_Results>;
  /** fetch aggregated fields from the table: "latest_payroll_version_results" */
  latest_payroll_version_results_aggregate: Latest_Payroll_Version_Results_Aggregate;
  /** fetch data from the table: "latest_payroll_version_results" using primary key columns */
  latest_payroll_version_results_by_pk: Maybe<Latest_Payroll_Version_Results>;
  /** fetch data from the table: "leave" */
  leave: Array<Leave>;
  /** fetch aggregated fields from the table: "leave" */
  leave_aggregate: Leave_Aggregate;
  /** fetch data from the table: "leave" using primary key columns */
  leave_by_pk: Maybe<Leave>;
  /** fetch data from the table: "neon_auth.users_sync" */
  neon_auth_users_sync: Array<Neon_Auth_Users_Sync>;
  /** fetch aggregated fields from the table: "neon_auth.users_sync" */
  neon_auth_users_sync_aggregate: Neon_Auth_Users_Sync_Aggregate;
  /** fetch data from the table: "neon_auth.users_sync" using primary key columns */
  neon_auth_users_sync_by_pk: Maybe<Neon_Auth_Users_Sync>;
  /** fetch data from the table: "notes" */
  notes: Array<Notes>;
  /** fetch aggregated fields from the table: "notes" */
  notes_aggregate: Notes_Aggregate;
  /** fetch data from the table: "notes" using primary key columns */
  notes_by_pk: Maybe<Notes>;
  /** fetch data from the table: "payroll_activation_results" */
  payroll_activation_results: Array<Payroll_Activation_Results>;
  /** fetch aggregated fields from the table: "payroll_activation_results" */
  payroll_activation_results_aggregate: Payroll_Activation_Results_Aggregate;
  /** fetch data from the table: "payroll_activation_results" using primary key columns */
  payroll_activation_results_by_pk: Maybe<Payroll_Activation_Results>;
  /** fetch data from the table: "payroll_cycles" */
  payroll_cycles: Array<Payroll_Cycles>;
  /** fetch aggregated fields from the table: "payroll_cycles" */
  payroll_cycles_aggregate: Payroll_Cycles_Aggregate;
  /** fetch data from the table: "payroll_cycles" using primary key columns */
  payroll_cycles_by_pk: Maybe<Payroll_Cycles>;
  /** fetch data from the table: "payroll_date_types" */
  payroll_date_types: Array<Payroll_Date_Types>;
  /** fetch aggregated fields from the table: "payroll_date_types" */
  payroll_date_types_aggregate: Payroll_Date_Types_Aggregate;
  /** fetch data from the table: "payroll_date_types" using primary key columns */
  payroll_date_types_by_pk: Maybe<Payroll_Date_Types>;
  /** An array relationship */
  payroll_dates: Array<Payroll_Dates>;
  /** An aggregate relationship */
  payroll_dates_aggregate: Payroll_Dates_Aggregate;
  /** fetch data from the table: "payroll_dates" using primary key columns */
  payroll_dates_by_pk: Maybe<Payroll_Dates>;
  /** fetch data from the table: "payroll_version_history_results" */
  payroll_version_history_results: Array<Payroll_Version_History_Results>;
  /** fetch aggregated fields from the table: "payroll_version_history_results" */
  payroll_version_history_results_aggregate: Payroll_Version_History_Results_Aggregate;
  /** fetch data from the table: "payroll_version_history_results" using primary key columns */
  payroll_version_history_results_by_pk: Maybe<Payroll_Version_History_Results>;
  /** fetch data from the table: "payroll_version_results" */
  payroll_version_results: Array<Payroll_Version_Results>;
  /** fetch aggregated fields from the table: "payroll_version_results" */
  payroll_version_results_aggregate: Payroll_Version_Results_Aggregate;
  /** fetch data from the table: "payroll_version_results" using primary key columns */
  payroll_version_results_by_pk: Maybe<Payroll_Version_Results>;
  /** An array relationship */
  payrolls: Array<Payrolls>;
  /** An aggregate relationship */
  payrolls_aggregate: Payrolls_Aggregate;
  /** fetch data from the table: "payrolls" using primary key columns */
  payrolls_by_pk: Maybe<Payrolls>;
  /** An array relationship */
  permissions: Array<Permissions>;
  /** An aggregate relationship */
  permissions_aggregate: Permissions_Aggregate;
  /** fetch data from the table: "permissions" using primary key columns */
  permissions_by_pk: Maybe<Permissions>;
  /** fetch data from the table: "resources" */
  resources: Array<Resources>;
  /** fetch aggregated fields from the table: "resources" */
  resources_aggregate: Resources_Aggregate;
  /** fetch data from the table: "resources" using primary key columns */
  resources_by_pk: Maybe<Resources>;
  /** An array relationship */
  role_permissions: Array<Role_Permissions>;
  /** An aggregate relationship */
  role_permissions_aggregate: Role_Permissions_Aggregate;
  /** fetch data from the table: "role_permissions" using primary key columns */
  role_permissions_by_pk: Maybe<Role_Permissions>;
  /** fetch data from the table: "roles" */
  roles: Array<Roles>;
  /** fetch aggregated fields from the table: "roles" */
  roles_aggregate: Roles_Aggregate;
  /** fetch data from the table: "roles" using primary key columns */
  roles_by_pk: Maybe<Roles>;
  /** An array relationship */
  user_roles: Array<User_Roles>;
  /** An aggregate relationship */
  user_roles_aggregate: User_Roles_Aggregate;
  /** fetch data from the table: "user_roles" using primary key columns */
  user_roles_by_pk: Maybe<User_Roles>;
  /** fetch data from the table: "users" */
  users: Array<Users>;
  /** fetch aggregated fields from the table: "users" */
  users_aggregate: Users_Aggregate;
  /** fetch data from the table: "users" using primary key columns */
  users_by_pk: Maybe<Users>;
  /** fetch data from the table: "users_role_backup" */
  users_role_backup: Array<Users_Role_Backup>;
  /** fetch aggregated fields from the table: "users_role_backup" */
  users_role_backup_aggregate: Users_Role_Backup_Aggregate;
  /** fetch data from the table: "work_schedule" */
  work_schedule: Array<Work_Schedule>;
  /** fetch aggregated fields from the table: "work_schedule" */
  work_schedule_aggregate: Work_Schedule_Aggregate;
  /** fetch data from the table: "work_schedule" using primary key columns */
  work_schedule_by_pk: Maybe<Work_Schedule>;
};

export type Query_Root_EntitiesArgs = {
  representations: Array<Scalars["_Any"]["input"]>;
};

export type Query_RootAdjustment_RulesArgs = {
  distinct_on?: InputMaybe<Array<Adjustment_Rules_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Adjustment_Rules_Order_By>>;
  where?: InputMaybe<Adjustment_Rules_Bool_Exp>;
};

export type Query_RootAdjustment_Rules_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Adjustment_Rules_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Adjustment_Rules_Order_By>>;
  where?: InputMaybe<Adjustment_Rules_Bool_Exp>;
};

export type Query_RootAdjustment_Rules_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootApp_SettingsArgs = {
  distinct_on?: InputMaybe<Array<App_Settings_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<App_Settings_Order_By>>;
  where?: InputMaybe<App_Settings_Bool_Exp>;
};

export type Query_RootApp_Settings_AggregateArgs = {
  distinct_on?: InputMaybe<Array<App_Settings_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<App_Settings_Order_By>>;
  where?: InputMaybe<App_Settings_Bool_Exp>;
};

export type Query_RootApp_Settings_By_PkArgs = {
  id: Scalars["String"]["input"];
};

export type Query_RootBilling_Event_LogArgs = {
  distinct_on?: InputMaybe<Array<Billing_Event_Log_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Billing_Event_Log_Order_By>>;
  where?: InputMaybe<Billing_Event_Log_Bool_Exp>;
};

export type Query_RootBilling_Event_Log_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Billing_Event_Log_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Billing_Event_Log_Order_By>>;
  where?: InputMaybe<Billing_Event_Log_Bool_Exp>;
};

export type Query_RootBilling_Event_Log_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootBilling_InvoiceArgs = {
  distinct_on?: InputMaybe<Array<Billing_Invoice_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Billing_Invoice_Order_By>>;
  where?: InputMaybe<Billing_Invoice_Bool_Exp>;
};

export type Query_RootBilling_Invoice_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Billing_Invoice_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Billing_Invoice_Order_By>>;
  where?: InputMaybe<Billing_Invoice_Bool_Exp>;
};

export type Query_RootBilling_Invoice_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootBilling_Invoice_ItemArgs = {
  distinct_on?: InputMaybe<Array<Billing_Invoice_Item_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Billing_Invoice_Item_Order_By>>;
  where?: InputMaybe<Billing_Invoice_Item_Bool_Exp>;
};

export type Query_RootBilling_Invoice_Item_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Billing_Invoice_Item_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Billing_Invoice_Item_Order_By>>;
  where?: InputMaybe<Billing_Invoice_Item_Bool_Exp>;
};

export type Query_RootBilling_Invoice_Item_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootBilling_InvoicesArgs = {
  distinct_on?: InputMaybe<Array<Billing_Invoices_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Billing_Invoices_Order_By>>;
  where?: InputMaybe<Billing_Invoices_Bool_Exp>;
};

export type Query_RootBilling_Invoices_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Billing_Invoices_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Billing_Invoices_Order_By>>;
  where?: InputMaybe<Billing_Invoices_Bool_Exp>;
};

export type Query_RootBilling_Invoices_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootBilling_ItemsArgs = {
  distinct_on?: InputMaybe<Array<Billing_Items_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Billing_Items_Order_By>>;
  where?: InputMaybe<Billing_Items_Bool_Exp>;
};

export type Query_RootBilling_Items_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Billing_Items_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Billing_Items_Order_By>>;
  where?: InputMaybe<Billing_Items_Bool_Exp>;
};

export type Query_RootBilling_Items_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootBilling_PlanArgs = {
  distinct_on?: InputMaybe<Array<Billing_Plan_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Billing_Plan_Order_By>>;
  where?: InputMaybe<Billing_Plan_Bool_Exp>;
};

export type Query_RootBilling_Plan_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Billing_Plan_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Billing_Plan_Order_By>>;
  where?: InputMaybe<Billing_Plan_Bool_Exp>;
};

export type Query_RootBilling_Plan_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootClient_Billing_AssignmentArgs = {
  distinct_on?: InputMaybe<Array<Client_Billing_Assignment_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Client_Billing_Assignment_Order_By>>;
  where?: InputMaybe<Client_Billing_Assignment_Bool_Exp>;
};

export type Query_RootClient_Billing_Assignment_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Client_Billing_Assignment_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Client_Billing_Assignment_Order_By>>;
  where?: InputMaybe<Client_Billing_Assignment_Bool_Exp>;
};

export type Query_RootClient_Billing_Assignment_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootClient_External_SystemsArgs = {
  distinct_on?: InputMaybe<Array<Client_External_Systems_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Client_External_Systems_Order_By>>;
  where?: InputMaybe<Client_External_Systems_Bool_Exp>;
};

export type Query_RootClient_External_Systems_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Client_External_Systems_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Client_External_Systems_Order_By>>;
  where?: InputMaybe<Client_External_Systems_Bool_Exp>;
};

export type Query_RootClient_External_Systems_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootClientsArgs = {
  distinct_on?: InputMaybe<Array<Clients_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Clients_Order_By>>;
  where?: InputMaybe<Clients_Bool_Exp>;
};

export type Query_RootClients_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Clients_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Clients_Order_By>>;
  where?: InputMaybe<Clients_Bool_Exp>;
};

export type Query_RootClients_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootCreate_Payroll_VersionArgs = {
  args: Create_Payroll_Version_Args;
  distinct_on?: InputMaybe<Array<Payroll_Version_Results_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payroll_Version_Results_Order_By>>;
  where?: InputMaybe<Payroll_Version_Results_Bool_Exp>;
};

export type Query_RootCreate_Payroll_Version_AggregateArgs = {
  args: Create_Payroll_Version_Args;
  distinct_on?: InputMaybe<Array<Payroll_Version_Results_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payroll_Version_Results_Order_By>>;
  where?: InputMaybe<Payroll_Version_Results_Bool_Exp>;
};

export type Query_RootCurrent_PayrollsArgs = {
  distinct_on?: InputMaybe<Array<Current_Payrolls_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Current_Payrolls_Order_By>>;
  where?: InputMaybe<Current_Payrolls_Bool_Exp>;
};

export type Query_RootCurrent_Payrolls_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Current_Payrolls_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Current_Payrolls_Order_By>>;
  where?: InputMaybe<Current_Payrolls_Bool_Exp>;
};

export type Query_RootExternal_SystemsArgs = {
  distinct_on?: InputMaybe<Array<External_Systems_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<External_Systems_Order_By>>;
  where?: InputMaybe<External_Systems_Bool_Exp>;
};

export type Query_RootExternal_Systems_AggregateArgs = {
  distinct_on?: InputMaybe<Array<External_Systems_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<External_Systems_Order_By>>;
  where?: InputMaybe<External_Systems_Bool_Exp>;
};

export type Query_RootExternal_Systems_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootFeature_FlagsArgs = {
  distinct_on?: InputMaybe<Array<Feature_Flags_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Feature_Flags_Order_By>>;
  where?: InputMaybe<Feature_Flags_Bool_Exp>;
};

export type Query_RootFeature_Flags_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Feature_Flags_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Feature_Flags_Order_By>>;
  where?: InputMaybe<Feature_Flags_Bool_Exp>;
};

export type Query_RootFeature_Flags_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootGenerate_Payroll_DatesArgs = {
  args: Generate_Payroll_Dates_Args;
  distinct_on?: InputMaybe<Array<Payroll_Dates_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payroll_Dates_Order_By>>;
  where?: InputMaybe<Payroll_Dates_Bool_Exp>;
};

export type Query_RootGenerate_Payroll_Dates_AggregateArgs = {
  args: Generate_Payroll_Dates_Args;
  distinct_on?: InputMaybe<Array<Payroll_Dates_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payroll_Dates_Order_By>>;
  where?: InputMaybe<Payroll_Dates_Bool_Exp>;
};

export type Query_RootHolidaysArgs = {
  distinct_on?: InputMaybe<Array<Holidays_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Holidays_Order_By>>;
  where?: InputMaybe<Holidays_Bool_Exp>;
};

export type Query_RootHolidays_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Holidays_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Holidays_Order_By>>;
  where?: InputMaybe<Holidays_Bool_Exp>;
};

export type Query_RootHolidays_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootLatest_Payroll_Version_ResultsArgs = {
  distinct_on?: InputMaybe<Array<Latest_Payroll_Version_Results_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Latest_Payroll_Version_Results_Order_By>>;
  where?: InputMaybe<Latest_Payroll_Version_Results_Bool_Exp>;
};

export type Query_RootLatest_Payroll_Version_Results_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Latest_Payroll_Version_Results_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Latest_Payroll_Version_Results_Order_By>>;
  where?: InputMaybe<Latest_Payroll_Version_Results_Bool_Exp>;
};

export type Query_RootLatest_Payroll_Version_Results_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootLeaveArgs = {
  distinct_on?: InputMaybe<Array<Leave_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Leave_Order_By>>;
  where?: InputMaybe<Leave_Bool_Exp>;
};

export type Query_RootLeave_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Leave_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Leave_Order_By>>;
  where?: InputMaybe<Leave_Bool_Exp>;
};

export type Query_RootLeave_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootNeon_Auth_Users_SyncArgs = {
  distinct_on?: InputMaybe<Array<Neon_Auth_Users_Sync_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Neon_Auth_Users_Sync_Order_By>>;
  where?: InputMaybe<Neon_Auth_Users_Sync_Bool_Exp>;
};

export type Query_RootNeon_Auth_Users_Sync_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Neon_Auth_Users_Sync_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Neon_Auth_Users_Sync_Order_By>>;
  where?: InputMaybe<Neon_Auth_Users_Sync_Bool_Exp>;
};

export type Query_RootNeon_Auth_Users_Sync_By_PkArgs = {
  id: Scalars["String"]["input"];
};

export type Query_RootNotesArgs = {
  distinct_on?: InputMaybe<Array<Notes_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Notes_Order_By>>;
  where?: InputMaybe<Notes_Bool_Exp>;
};

export type Query_RootNotes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Notes_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Notes_Order_By>>;
  where?: InputMaybe<Notes_Bool_Exp>;
};

export type Query_RootNotes_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootPayroll_Activation_ResultsArgs = {
  distinct_on?: InputMaybe<Array<Payroll_Activation_Results_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payroll_Activation_Results_Order_By>>;
  where?: InputMaybe<Payroll_Activation_Results_Bool_Exp>;
};

export type Query_RootPayroll_Activation_Results_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payroll_Activation_Results_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payroll_Activation_Results_Order_By>>;
  where?: InputMaybe<Payroll_Activation_Results_Bool_Exp>;
};

export type Query_RootPayroll_Activation_Results_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootPayroll_CyclesArgs = {
  distinct_on?: InputMaybe<Array<Payroll_Cycles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payroll_Cycles_Order_By>>;
  where?: InputMaybe<Payroll_Cycles_Bool_Exp>;
};

export type Query_RootPayroll_Cycles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payroll_Cycles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payroll_Cycles_Order_By>>;
  where?: InputMaybe<Payroll_Cycles_Bool_Exp>;
};

export type Query_RootPayroll_Cycles_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootPayroll_Date_TypesArgs = {
  distinct_on?: InputMaybe<Array<Payroll_Date_Types_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payroll_Date_Types_Order_By>>;
  where?: InputMaybe<Payroll_Date_Types_Bool_Exp>;
};

export type Query_RootPayroll_Date_Types_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payroll_Date_Types_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payroll_Date_Types_Order_By>>;
  where?: InputMaybe<Payroll_Date_Types_Bool_Exp>;
};

export type Query_RootPayroll_Date_Types_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootPayroll_DatesArgs = {
  distinct_on?: InputMaybe<Array<Payroll_Dates_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payroll_Dates_Order_By>>;
  where?: InputMaybe<Payroll_Dates_Bool_Exp>;
};

export type Query_RootPayroll_Dates_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payroll_Dates_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payroll_Dates_Order_By>>;
  where?: InputMaybe<Payroll_Dates_Bool_Exp>;
};

export type Query_RootPayroll_Dates_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootPayroll_Version_History_ResultsArgs = {
  distinct_on?: InputMaybe<
    Array<Payroll_Version_History_Results_Select_Column>
  >;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payroll_Version_History_Results_Order_By>>;
  where?: InputMaybe<Payroll_Version_History_Results_Bool_Exp>;
};

export type Query_RootPayroll_Version_History_Results_AggregateArgs = {
  distinct_on?: InputMaybe<
    Array<Payroll_Version_History_Results_Select_Column>
  >;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payroll_Version_History_Results_Order_By>>;
  where?: InputMaybe<Payroll_Version_History_Results_Bool_Exp>;
};

export type Query_RootPayroll_Version_History_Results_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootPayroll_Version_ResultsArgs = {
  distinct_on?: InputMaybe<Array<Payroll_Version_Results_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payroll_Version_Results_Order_By>>;
  where?: InputMaybe<Payroll_Version_Results_Bool_Exp>;
};

export type Query_RootPayroll_Version_Results_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payroll_Version_Results_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payroll_Version_Results_Order_By>>;
  where?: InputMaybe<Payroll_Version_Results_Bool_Exp>;
};

export type Query_RootPayroll_Version_Results_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootPayrollsArgs = {
  distinct_on?: InputMaybe<Array<Payrolls_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payrolls_Order_By>>;
  where?: InputMaybe<Payrolls_Bool_Exp>;
};

export type Query_RootPayrolls_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payrolls_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payrolls_Order_By>>;
  where?: InputMaybe<Payrolls_Bool_Exp>;
};

export type Query_RootPayrolls_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootPermissionsArgs = {
  distinct_on?: InputMaybe<Array<Permissions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Permissions_Order_By>>;
  where?: InputMaybe<Permissions_Bool_Exp>;
};

export type Query_RootPermissions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Permissions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Permissions_Order_By>>;
  where?: InputMaybe<Permissions_Bool_Exp>;
};

export type Query_RootPermissions_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootResourcesArgs = {
  distinct_on?: InputMaybe<Array<Resources_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Resources_Order_By>>;
  where?: InputMaybe<Resources_Bool_Exp>;
};

export type Query_RootResources_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Resources_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Resources_Order_By>>;
  where?: InputMaybe<Resources_Bool_Exp>;
};

export type Query_RootResources_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootRole_PermissionsArgs = {
  distinct_on?: InputMaybe<Array<Role_Permissions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Role_Permissions_Order_By>>;
  where?: InputMaybe<Role_Permissions_Bool_Exp>;
};

export type Query_RootRole_Permissions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Role_Permissions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Role_Permissions_Order_By>>;
  where?: InputMaybe<Role_Permissions_Bool_Exp>;
};

export type Query_RootRole_Permissions_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootRolesArgs = {
  distinct_on?: InputMaybe<Array<Roles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Roles_Order_By>>;
  where?: InputMaybe<Roles_Bool_Exp>;
};

export type Query_RootRoles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Roles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Roles_Order_By>>;
  where?: InputMaybe<Roles_Bool_Exp>;
};

export type Query_RootRoles_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootUser_RolesArgs = {
  distinct_on?: InputMaybe<Array<User_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<User_Roles_Order_By>>;
  where?: InputMaybe<User_Roles_Bool_Exp>;
};

export type Query_RootUser_Roles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<User_Roles_Order_By>>;
  where?: InputMaybe<User_Roles_Bool_Exp>;
};

export type Query_RootUser_Roles_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootUsersArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};

export type Query_RootUsers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};

export type Query_RootUsers_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootUsers_Role_BackupArgs = {
  distinct_on?: InputMaybe<Array<Users_Role_Backup_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Users_Role_Backup_Order_By>>;
  where?: InputMaybe<Users_Role_Backup_Bool_Exp>;
};

export type Query_RootUsers_Role_Backup_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Role_Backup_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Users_Role_Backup_Order_By>>;
  where?: InputMaybe<Users_Role_Backup_Bool_Exp>;
};

export type Query_RootWork_ScheduleArgs = {
  distinct_on?: InputMaybe<Array<Work_Schedule_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Work_Schedule_Order_By>>;
  where?: InputMaybe<Work_Schedule_Bool_Exp>;
};

export type Query_RootWork_Schedule_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Work_Schedule_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Work_Schedule_Order_By>>;
  where?: InputMaybe<Work_Schedule_Bool_Exp>;
};

export type Query_RootWork_Schedule_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** columns and relationships of "resources" */
export type Resources = {
  __typename: "resources";
  created_at: Scalars["timestamptz"]["output"];
  description: Maybe<Scalars["String"]["output"]>;
  display_name: Scalars["String"]["output"];
  id: Scalars["uuid"]["output"];
  name: Scalars["String"]["output"];
  /** An array relationship */
  permissions: Array<Permissions>;
  /** An aggregate relationship */
  permissions_aggregate: Permissions_Aggregate;
  updated_at: Scalars["timestamptz"]["output"];
};

/** columns and relationships of "resources" */
export type ResourcesPermissionsArgs = {
  distinct_on?: InputMaybe<Array<Permissions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Permissions_Order_By>>;
  where?: InputMaybe<Permissions_Bool_Exp>;
};

/** columns and relationships of "resources" */
export type ResourcesPermissions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Permissions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Permissions_Order_By>>;
  where?: InputMaybe<Permissions_Bool_Exp>;
};

/** aggregated selection of "resources" */
export type Resources_Aggregate = {
  __typename: "resources_aggregate";
  aggregate: Maybe<Resources_Aggregate_Fields>;
  nodes: Array<Resources>;
};

/** aggregate fields of "resources" */
export type Resources_Aggregate_Fields = {
  __typename: "resources_aggregate_fields";
  count: Scalars["Int"]["output"];
  max: Maybe<Resources_Max_Fields>;
  min: Maybe<Resources_Min_Fields>;
};

/** aggregate fields of "resources" */
export type Resources_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Resources_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** Boolean expression to filter rows from the table "resources". All fields are combined with a logical 'AND'. */
export type Resources_Bool_Exp = {
  _and?: InputMaybe<Array<Resources_Bool_Exp>>;
  _not?: InputMaybe<Resources_Bool_Exp>;
  _or?: InputMaybe<Array<Resources_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  display_name?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  permissions?: InputMaybe<Permissions_Bool_Exp>;
  permissions_aggregate?: InputMaybe<Permissions_Aggregate_Bool_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "resources" */
export type Resources_Constraint =
  /** unique or primary key constraint on columns "name" */
  | "resources_name_key"
  /** unique or primary key constraint on columns "id" */
  | "resources_pkey";

/** input type for inserting data into table "resources" */
export type Resources_Insert_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  display_name?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  permissions?: InputMaybe<Permissions_Arr_Rel_Insert_Input>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** aggregate max on columns */
export type Resources_Max_Fields = {
  __typename: "resources_max_fields";
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  description: Maybe<Scalars["String"]["output"]>;
  display_name: Maybe<Scalars["String"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  name: Maybe<Scalars["String"]["output"]>;
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
};

/** aggregate min on columns */
export type Resources_Min_Fields = {
  __typename: "resources_min_fields";
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  description: Maybe<Scalars["String"]["output"]>;
  display_name: Maybe<Scalars["String"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  name: Maybe<Scalars["String"]["output"]>;
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
};

/** response of any mutation on the table "resources" */
export type Resources_Mutation_Response = {
  __typename: "resources_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Resources>;
};

/** input type for inserting object relation for remote table "resources" */
export type Resources_Obj_Rel_Insert_Input = {
  data: Resources_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Resources_On_Conflict>;
};

/** on_conflict condition type for table "resources" */
export type Resources_On_Conflict = {
  constraint: Resources_Constraint;
  update_columns?: Array<Resources_Update_Column>;
  where?: InputMaybe<Resources_Bool_Exp>;
};

/** Ordering options when selecting data from "resources". */
export type Resources_Order_By = {
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  display_name?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  permissions_aggregate?: InputMaybe<Permissions_Aggregate_Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: resources */
export type Resources_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "resources" */
export type Resources_Select_Column =
  /** column name */
  | "created_at"
  /** column name */
  | "description"
  /** column name */
  | "display_name"
  /** column name */
  | "id"
  /** column name */
  | "name"
  /** column name */
  | "updated_at";

/** input type for updating data in table "resources" */
export type Resources_Set_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  display_name?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** Streaming cursor of the table "resources" */
export type Resources_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Resources_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Resources_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  display_name?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** update columns of table "resources" */
export type Resources_Update_Column =
  /** column name */
  | "created_at"
  /** column name */
  | "description"
  /** column name */
  | "display_name"
  /** column name */
  | "id"
  /** column name */
  | "name"
  /** column name */
  | "updated_at";

export type Resources_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Resources_Set_Input>;
  /** filter the rows which have to be updated */
  where: Resources_Bool_Exp;
};

/** columns and relationships of "role_permissions" */
export type Role_Permissions = {
  __typename: "role_permissions";
  conditions: Maybe<Scalars["jsonb"]["output"]>;
  created_at: Scalars["timestamptz"]["output"];
  id: Scalars["uuid"]["output"];
  /** An object relationship */
  permission: Permissions;
  permission_id: Scalars["uuid"]["output"];
  /** An object relationship */
  role: Roles;
  role_id: Scalars["uuid"]["output"];
  updated_at: Scalars["timestamptz"]["output"];
};

/** columns and relationships of "role_permissions" */
export type Role_PermissionsConditionsArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregated selection of "role_permissions" */
export type Role_Permissions_Aggregate = {
  __typename: "role_permissions_aggregate";
  aggregate: Maybe<Role_Permissions_Aggregate_Fields>;
  nodes: Array<Role_Permissions>;
};

export type Role_Permissions_Aggregate_Bool_Exp = {
  count?: InputMaybe<Role_Permissions_Aggregate_Bool_Exp_Count>;
};

export type Role_Permissions_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Role_Permissions_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Role_Permissions_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "role_permissions" */
export type Role_Permissions_Aggregate_Fields = {
  __typename: "role_permissions_aggregate_fields";
  count: Scalars["Int"]["output"];
  max: Maybe<Role_Permissions_Max_Fields>;
  min: Maybe<Role_Permissions_Min_Fields>;
};

/** aggregate fields of "role_permissions" */
export type Role_Permissions_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Role_Permissions_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "role_permissions" */
export type Role_Permissions_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Role_Permissions_Max_Order_By>;
  min?: InputMaybe<Role_Permissions_Min_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Role_Permissions_Append_Input = {
  conditions?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** input type for inserting array relation for remote table "role_permissions" */
export type Role_Permissions_Arr_Rel_Insert_Input = {
  data: Array<Role_Permissions_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Role_Permissions_On_Conflict>;
};

/** Boolean expression to filter rows from the table "role_permissions". All fields are combined with a logical 'AND'. */
export type Role_Permissions_Bool_Exp = {
  _and?: InputMaybe<Array<Role_Permissions_Bool_Exp>>;
  _not?: InputMaybe<Role_Permissions_Bool_Exp>;
  _or?: InputMaybe<Array<Role_Permissions_Bool_Exp>>;
  conditions?: InputMaybe<Jsonb_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  permission?: InputMaybe<Permissions_Bool_Exp>;
  permission_id?: InputMaybe<Uuid_Comparison_Exp>;
  role?: InputMaybe<Roles_Bool_Exp>;
  role_id?: InputMaybe<Uuid_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "role_permissions" */
export type Role_Permissions_Constraint =
  /** unique or primary key constraint on columns "id" */
  | "role_permissions_pkey"
  /** unique or primary key constraint on columns "permission_id", "role_id" */
  | "role_permissions_role_id_permission_id_key";

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Role_Permissions_Delete_At_Path_Input = {
  conditions?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Role_Permissions_Delete_Elem_Input = {
  conditions?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Role_Permissions_Delete_Key_Input = {
  conditions?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for inserting data into table "role_permissions" */
export type Role_Permissions_Insert_Input = {
  conditions?: InputMaybe<Scalars["jsonb"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  permission?: InputMaybe<Permissions_Obj_Rel_Insert_Input>;
  permission_id?: InputMaybe<Scalars["uuid"]["input"]>;
  role?: InputMaybe<Roles_Obj_Rel_Insert_Input>;
  role_id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** aggregate max on columns */
export type Role_Permissions_Max_Fields = {
  __typename: "role_permissions_max_fields";
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  permission_id: Maybe<Scalars["uuid"]["output"]>;
  role_id: Maybe<Scalars["uuid"]["output"]>;
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
};

/** order by max() on columns of table "role_permissions" */
export type Role_Permissions_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  permission_id?: InputMaybe<Order_By>;
  role_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Role_Permissions_Min_Fields = {
  __typename: "role_permissions_min_fields";
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  permission_id: Maybe<Scalars["uuid"]["output"]>;
  role_id: Maybe<Scalars["uuid"]["output"]>;
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
};

/** order by min() on columns of table "role_permissions" */
export type Role_Permissions_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  permission_id?: InputMaybe<Order_By>;
  role_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "role_permissions" */
export type Role_Permissions_Mutation_Response = {
  __typename: "role_permissions_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Role_Permissions>;
};

/** on_conflict condition type for table "role_permissions" */
export type Role_Permissions_On_Conflict = {
  constraint: Role_Permissions_Constraint;
  update_columns?: Array<Role_Permissions_Update_Column>;
  where?: InputMaybe<Role_Permissions_Bool_Exp>;
};

/** Ordering options when selecting data from "role_permissions". */
export type Role_Permissions_Order_By = {
  conditions?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  permission?: InputMaybe<Permissions_Order_By>;
  permission_id?: InputMaybe<Order_By>;
  role?: InputMaybe<Roles_Order_By>;
  role_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: role_permissions */
export type Role_Permissions_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Role_Permissions_Prepend_Input = {
  conditions?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "role_permissions" */
export type Role_Permissions_Select_Column =
  /** column name */
  | "conditions"
  /** column name */
  | "created_at"
  /** column name */
  | "id"
  /** column name */
  | "permission_id"
  /** column name */
  | "role_id"
  /** column name */
  | "updated_at";

/** input type for updating data in table "role_permissions" */
export type Role_Permissions_Set_Input = {
  conditions?: InputMaybe<Scalars["jsonb"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  permission_id?: InputMaybe<Scalars["uuid"]["input"]>;
  role_id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** Streaming cursor of the table "role_permissions" */
export type Role_Permissions_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Role_Permissions_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Role_Permissions_Stream_Cursor_Value_Input = {
  conditions?: InputMaybe<Scalars["jsonb"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  permission_id?: InputMaybe<Scalars["uuid"]["input"]>;
  role_id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** update columns of table "role_permissions" */
export type Role_Permissions_Update_Column =
  /** column name */
  | "conditions"
  /** column name */
  | "created_at"
  /** column name */
  | "id"
  /** column name */
  | "permission_id"
  /** column name */
  | "role_id"
  /** column name */
  | "updated_at";

export type Role_Permissions_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Role_Permissions_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Role_Permissions_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Role_Permissions_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Role_Permissions_Delete_Key_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Role_Permissions_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Role_Permissions_Set_Input>;
  /** filter the rows which have to be updated */
  where: Role_Permissions_Bool_Exp;
};

/** columns and relationships of "roles" */
export type Roles = {
  __typename: "roles";
  created_at: Scalars["timestamptz"]["output"];
  description: Maybe<Scalars["String"]["output"]>;
  display_name: Scalars["String"]["output"];
  id: Scalars["uuid"]["output"];
  is_system_role: Scalars["Boolean"]["output"];
  name: Scalars["String"]["output"];
  priority: Scalars["Int"]["output"];
  /** An array relationship */
  role_permissions: Array<Role_Permissions>;
  /** An aggregate relationship */
  role_permissions_aggregate: Role_Permissions_Aggregate;
  updated_at: Scalars["timestamptz"]["output"];
  /** An array relationship */
  user_roles: Array<User_Roles>;
  /** An aggregate relationship */
  user_roles_aggregate: User_Roles_Aggregate;
};

/** columns and relationships of "roles" */
export type RolesRole_PermissionsArgs = {
  distinct_on?: InputMaybe<Array<Role_Permissions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Role_Permissions_Order_By>>;
  where?: InputMaybe<Role_Permissions_Bool_Exp>;
};

/** columns and relationships of "roles" */
export type RolesRole_Permissions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Role_Permissions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Role_Permissions_Order_By>>;
  where?: InputMaybe<Role_Permissions_Bool_Exp>;
};

/** columns and relationships of "roles" */
export type RolesUser_RolesArgs = {
  distinct_on?: InputMaybe<Array<User_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<User_Roles_Order_By>>;
  where?: InputMaybe<User_Roles_Bool_Exp>;
};

/** columns and relationships of "roles" */
export type RolesUser_Roles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<User_Roles_Order_By>>;
  where?: InputMaybe<User_Roles_Bool_Exp>;
};

/** aggregated selection of "roles" */
export type Roles_Aggregate = {
  __typename: "roles_aggregate";
  aggregate: Maybe<Roles_Aggregate_Fields>;
  nodes: Array<Roles>;
};

/** aggregate fields of "roles" */
export type Roles_Aggregate_Fields = {
  __typename: "roles_aggregate_fields";
  avg: Maybe<Roles_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max: Maybe<Roles_Max_Fields>;
  min: Maybe<Roles_Min_Fields>;
  stddev: Maybe<Roles_Stddev_Fields>;
  stddev_pop: Maybe<Roles_Stddev_Pop_Fields>;
  stddev_samp: Maybe<Roles_Stddev_Samp_Fields>;
  sum: Maybe<Roles_Sum_Fields>;
  var_pop: Maybe<Roles_Var_Pop_Fields>;
  var_samp: Maybe<Roles_Var_Samp_Fields>;
  variance: Maybe<Roles_Variance_Fields>;
};

/** aggregate fields of "roles" */
export type Roles_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Roles_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** aggregate avg on columns */
export type Roles_Avg_Fields = {
  __typename: "roles_avg_fields";
  priority: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to filter rows from the table "roles". All fields are combined with a logical 'AND'. */
export type Roles_Bool_Exp = {
  _and?: InputMaybe<Array<Roles_Bool_Exp>>;
  _not?: InputMaybe<Roles_Bool_Exp>;
  _or?: InputMaybe<Array<Roles_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  display_name?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  is_system_role?: InputMaybe<Boolean_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  priority?: InputMaybe<Int_Comparison_Exp>;
  role_permissions?: InputMaybe<Role_Permissions_Bool_Exp>;
  role_permissions_aggregate?: InputMaybe<Role_Permissions_Aggregate_Bool_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  user_roles?: InputMaybe<User_Roles_Bool_Exp>;
  user_roles_aggregate?: InputMaybe<User_Roles_Aggregate_Bool_Exp>;
};

/** unique or primary key constraints on table "roles" */
export type Roles_Constraint =
  /** unique or primary key constraint on columns "name" */
  | "roles_name_key"
  /** unique or primary key constraint on columns "id" */
  | "roles_pkey";

/** input type for incrementing numeric columns in table "roles" */
export type Roles_Inc_Input = {
  priority?: InputMaybe<Scalars["Int"]["input"]>;
};

/** input type for inserting data into table "roles" */
export type Roles_Insert_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  display_name?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  is_system_role?: InputMaybe<Scalars["Boolean"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  priority?: InputMaybe<Scalars["Int"]["input"]>;
  role_permissions?: InputMaybe<Role_Permissions_Arr_Rel_Insert_Input>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user_roles?: InputMaybe<User_Roles_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Roles_Max_Fields = {
  __typename: "roles_max_fields";
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  description: Maybe<Scalars["String"]["output"]>;
  display_name: Maybe<Scalars["String"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  name: Maybe<Scalars["String"]["output"]>;
  priority: Maybe<Scalars["Int"]["output"]>;
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
};

/** aggregate min on columns */
export type Roles_Min_Fields = {
  __typename: "roles_min_fields";
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  description: Maybe<Scalars["String"]["output"]>;
  display_name: Maybe<Scalars["String"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  name: Maybe<Scalars["String"]["output"]>;
  priority: Maybe<Scalars["Int"]["output"]>;
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
};

/** response of any mutation on the table "roles" */
export type Roles_Mutation_Response = {
  __typename: "roles_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Roles>;
};

/** input type for inserting object relation for remote table "roles" */
export type Roles_Obj_Rel_Insert_Input = {
  data: Roles_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Roles_On_Conflict>;
};

/** on_conflict condition type for table "roles" */
export type Roles_On_Conflict = {
  constraint: Roles_Constraint;
  update_columns?: Array<Roles_Update_Column>;
  where?: InputMaybe<Roles_Bool_Exp>;
};

/** Ordering options when selecting data from "roles". */
export type Roles_Order_By = {
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  display_name?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_system_role?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  priority?: InputMaybe<Order_By>;
  role_permissions_aggregate?: InputMaybe<Role_Permissions_Aggregate_Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_roles_aggregate?: InputMaybe<User_Roles_Aggregate_Order_By>;
};

/** primary key columns input for table: roles */
export type Roles_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "roles" */
export type Roles_Select_Column =
  /** column name */
  | "created_at"
  /** column name */
  | "description"
  /** column name */
  | "display_name"
  /** column name */
  | "id"
  /** column name */
  | "is_system_role"
  /** column name */
  | "name"
  /** column name */
  | "priority"
  /** column name */
  | "updated_at";

/** input type for updating data in table "roles" */
export type Roles_Set_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  display_name?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  is_system_role?: InputMaybe<Scalars["Boolean"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  priority?: InputMaybe<Scalars["Int"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** aggregate stddev on columns */
export type Roles_Stddev_Fields = {
  __typename: "roles_stddev_fields";
  priority: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type Roles_Stddev_Pop_Fields = {
  __typename: "roles_stddev_pop_fields";
  priority: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type Roles_Stddev_Samp_Fields = {
  __typename: "roles_stddev_samp_fields";
  priority: Maybe<Scalars["Float"]["output"]>;
};

/** Streaming cursor of the table "roles" */
export type Roles_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Roles_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Roles_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  display_name?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  is_system_role?: InputMaybe<Scalars["Boolean"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  priority?: InputMaybe<Scalars["Int"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** aggregate sum on columns */
export type Roles_Sum_Fields = {
  __typename: "roles_sum_fields";
  priority: Maybe<Scalars["Int"]["output"]>;
};

/** update columns of table "roles" */
export type Roles_Update_Column =
  /** column name */
  | "created_at"
  /** column name */
  | "description"
  /** column name */
  | "display_name"
  /** column name */
  | "id"
  /** column name */
  | "is_system_role"
  /** column name */
  | "name"
  /** column name */
  | "priority"
  /** column name */
  | "updated_at";

export type Roles_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Roles_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Roles_Set_Input>;
  /** filter the rows which have to be updated */
  where: Roles_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Roles_Var_Pop_Fields = {
  __typename: "roles_var_pop_fields";
  priority: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate var_samp on columns */
export type Roles_Var_Samp_Fields = {
  __typename: "roles_var_samp_fields";
  priority: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate variance on columns */
export type Roles_Variance_Fields = {
  __typename: "roles_variance_fields";
  priority: Maybe<Scalars["Float"]["output"]>;
};

export type Subscription_Root = {
  __typename: "subscription_root";
  /** An array relationship */
  adjustment_rules: Array<Adjustment_Rules>;
  /** An aggregate relationship */
  adjustment_rules_aggregate: Adjustment_Rules_Aggregate;
  /** fetch data from the table: "adjustment_rules" using primary key columns */
  adjustment_rules_by_pk: Maybe<Adjustment_Rules>;
  /** fetch data from the table in a streaming manner: "adjustment_rules" */
  adjustment_rules_stream: Array<Adjustment_Rules>;
  /** fetch data from the table: "app_settings" */
  app_settings: Array<App_Settings>;
  /** fetch aggregated fields from the table: "app_settings" */
  app_settings_aggregate: App_Settings_Aggregate;
  /** fetch data from the table: "app_settings" using primary key columns */
  app_settings_by_pk: Maybe<App_Settings>;
  /** fetch data from the table in a streaming manner: "app_settings" */
  app_settings_stream: Array<App_Settings>;
  /** fetch data from the table: "billing_event_log" */
  billing_event_log: Array<Billing_Event_Log>;
  /** fetch aggregated fields from the table: "billing_event_log" */
  billing_event_log_aggregate: Billing_Event_Log_Aggregate;
  /** fetch data from the table: "billing_event_log" using primary key columns */
  billing_event_log_by_pk: Maybe<Billing_Event_Log>;
  /** fetch data from the table in a streaming manner: "billing_event_log" */
  billing_event_log_stream: Array<Billing_Event_Log>;
  /** fetch data from the table: "billing_invoice" */
  billing_invoice: Array<Billing_Invoice>;
  /** fetch aggregated fields from the table: "billing_invoice" */
  billing_invoice_aggregate: Billing_Invoice_Aggregate;
  /** fetch data from the table: "billing_invoice" using primary key columns */
  billing_invoice_by_pk: Maybe<Billing_Invoice>;
  /** fetch data from the table: "billing_invoice_item" */
  billing_invoice_item: Array<Billing_Invoice_Item>;
  /** fetch aggregated fields from the table: "billing_invoice_item" */
  billing_invoice_item_aggregate: Billing_Invoice_Item_Aggregate;
  /** fetch data from the table: "billing_invoice_item" using primary key columns */
  billing_invoice_item_by_pk: Maybe<Billing_Invoice_Item>;
  /** fetch data from the table in a streaming manner: "billing_invoice_item" */
  billing_invoice_item_stream: Array<Billing_Invoice_Item>;
  /** fetch data from the table in a streaming manner: "billing_invoice" */
  billing_invoice_stream: Array<Billing_Invoice>;
  /** fetch data from the table: "billing_invoices" */
  billing_invoices: Array<Billing_Invoices>;
  /** fetch aggregated fields from the table: "billing_invoices" */
  billing_invoices_aggregate: Billing_Invoices_Aggregate;
  /** fetch data from the table: "billing_invoices" using primary key columns */
  billing_invoices_by_pk: Maybe<Billing_Invoices>;
  /** fetch data from the table in a streaming manner: "billing_invoices" */
  billing_invoices_stream: Array<Billing_Invoices>;
  /** An array relationship */
  billing_items: Array<Billing_Items>;
  /** An aggregate relationship */
  billing_items_aggregate: Billing_Items_Aggregate;
  /** fetch data from the table: "billing_items" using primary key columns */
  billing_items_by_pk: Maybe<Billing_Items>;
  /** fetch data from the table in a streaming manner: "billing_items" */
  billing_items_stream: Array<Billing_Items>;
  /** fetch data from the table: "billing_plan" */
  billing_plan: Array<Billing_Plan>;
  /** fetch aggregated fields from the table: "billing_plan" */
  billing_plan_aggregate: Billing_Plan_Aggregate;
  /** fetch data from the table: "billing_plan" using primary key columns */
  billing_plan_by_pk: Maybe<Billing_Plan>;
  /** fetch data from the table in a streaming manner: "billing_plan" */
  billing_plan_stream: Array<Billing_Plan>;
  /** fetch data from the table: "client_billing_assignment" */
  client_billing_assignment: Array<Client_Billing_Assignment>;
  /** fetch aggregated fields from the table: "client_billing_assignment" */
  client_billing_assignment_aggregate: Client_Billing_Assignment_Aggregate;
  /** fetch data from the table: "client_billing_assignment" using primary key columns */
  client_billing_assignment_by_pk: Maybe<Client_Billing_Assignment>;
  /** fetch data from the table in a streaming manner: "client_billing_assignment" */
  client_billing_assignment_stream: Array<Client_Billing_Assignment>;
  /** An array relationship */
  client_external_systems: Array<Client_External_Systems>;
  /** An aggregate relationship */
  client_external_systems_aggregate: Client_External_Systems_Aggregate;
  /** fetch data from the table: "client_external_systems" using primary key columns */
  client_external_systems_by_pk: Maybe<Client_External_Systems>;
  /** fetch data from the table in a streaming manner: "client_external_systems" */
  client_external_systems_stream: Array<Client_External_Systems>;
  /** fetch data from the table: "clients" */
  clients: Array<Clients>;
  /** fetch aggregated fields from the table: "clients" */
  clients_aggregate: Clients_Aggregate;
  /** fetch data from the table: "clients" using primary key columns */
  clients_by_pk: Maybe<Clients>;
  /** fetch data from the table in a streaming manner: "clients" */
  clients_stream: Array<Clients>;
  /** execute function "create_payroll_version" which returns "payroll_version_results" */
  create_payroll_version: Array<Payroll_Version_Results>;
  /** execute function "create_payroll_version" and query aggregates on result of table type "payroll_version_results" */
  create_payroll_version_aggregate: Payroll_Version_Results_Aggregate;
  /** fetch data from the table: "current_payrolls" */
  current_payrolls: Array<Current_Payrolls>;
  /** fetch aggregated fields from the table: "current_payrolls" */
  current_payrolls_aggregate: Current_Payrolls_Aggregate;
  /** fetch data from the table in a streaming manner: "current_payrolls" */
  current_payrolls_stream: Array<Current_Payrolls>;
  /** fetch data from the table: "external_systems" */
  external_systems: Array<External_Systems>;
  /** fetch aggregated fields from the table: "external_systems" */
  external_systems_aggregate: External_Systems_Aggregate;
  /** fetch data from the table: "external_systems" using primary key columns */
  external_systems_by_pk: Maybe<External_Systems>;
  /** fetch data from the table in a streaming manner: "external_systems" */
  external_systems_stream: Array<External_Systems>;
  /** fetch data from the table: "feature_flags" */
  feature_flags: Array<Feature_Flags>;
  /** fetch aggregated fields from the table: "feature_flags" */
  feature_flags_aggregate: Feature_Flags_Aggregate;
  /** fetch data from the table: "feature_flags" using primary key columns */
  feature_flags_by_pk: Maybe<Feature_Flags>;
  /** fetch data from the table in a streaming manner: "feature_flags" */
  feature_flags_stream: Array<Feature_Flags>;
  /** execute function "generate_payroll_dates" which returns "payroll_dates" */
  generate_payroll_dates: Array<Payroll_Dates>;
  /** execute function "generate_payroll_dates" and query aggregates on result of table type "payroll_dates" */
  generate_payroll_dates_aggregate: Payroll_Dates_Aggregate;
  /** fetch data from the table: "holidays" */
  holidays: Array<Holidays>;
  /** fetch aggregated fields from the table: "holidays" */
  holidays_aggregate: Holidays_Aggregate;
  /** fetch data from the table: "holidays" using primary key columns */
  holidays_by_pk: Maybe<Holidays>;
  /** fetch data from the table in a streaming manner: "holidays" */
  holidays_stream: Array<Holidays>;
  /** fetch data from the table: "latest_payroll_version_results" */
  latest_payroll_version_results: Array<Latest_Payroll_Version_Results>;
  /** fetch aggregated fields from the table: "latest_payroll_version_results" */
  latest_payroll_version_results_aggregate: Latest_Payroll_Version_Results_Aggregate;
  /** fetch data from the table: "latest_payroll_version_results" using primary key columns */
  latest_payroll_version_results_by_pk: Maybe<Latest_Payroll_Version_Results>;
  /** fetch data from the table in a streaming manner: "latest_payroll_version_results" */
  latest_payroll_version_results_stream: Array<Latest_Payroll_Version_Results>;
  /** fetch data from the table: "leave" */
  leave: Array<Leave>;
  /** fetch aggregated fields from the table: "leave" */
  leave_aggregate: Leave_Aggregate;
  /** fetch data from the table: "leave" using primary key columns */
  leave_by_pk: Maybe<Leave>;
  /** fetch data from the table in a streaming manner: "leave" */
  leave_stream: Array<Leave>;
  /** fetch data from the table: "neon_auth.users_sync" */
  neon_auth_users_sync: Array<Neon_Auth_Users_Sync>;
  /** fetch aggregated fields from the table: "neon_auth.users_sync" */
  neon_auth_users_sync_aggregate: Neon_Auth_Users_Sync_Aggregate;
  /** fetch data from the table: "neon_auth.users_sync" using primary key columns */
  neon_auth_users_sync_by_pk: Maybe<Neon_Auth_Users_Sync>;
  /** fetch data from the table in a streaming manner: "neon_auth.users_sync" */
  neon_auth_users_sync_stream: Array<Neon_Auth_Users_Sync>;
  /** fetch data from the table: "notes" */
  notes: Array<Notes>;
  /** fetch aggregated fields from the table: "notes" */
  notes_aggregate: Notes_Aggregate;
  /** fetch data from the table: "notes" using primary key columns */
  notes_by_pk: Maybe<Notes>;
  /** fetch data from the table in a streaming manner: "notes" */
  notes_stream: Array<Notes>;
  /** fetch data from the table: "payroll_activation_results" */
  payroll_activation_results: Array<Payroll_Activation_Results>;
  /** fetch aggregated fields from the table: "payroll_activation_results" */
  payroll_activation_results_aggregate: Payroll_Activation_Results_Aggregate;
  /** fetch data from the table: "payroll_activation_results" using primary key columns */
  payroll_activation_results_by_pk: Maybe<Payroll_Activation_Results>;
  /** fetch data from the table in a streaming manner: "payroll_activation_results" */
  payroll_activation_results_stream: Array<Payroll_Activation_Results>;
  /** fetch data from the table: "payroll_cycles" */
  payroll_cycles: Array<Payroll_Cycles>;
  /** fetch aggregated fields from the table: "payroll_cycles" */
  payroll_cycles_aggregate: Payroll_Cycles_Aggregate;
  /** fetch data from the table: "payroll_cycles" using primary key columns */
  payroll_cycles_by_pk: Maybe<Payroll_Cycles>;
  /** fetch data from the table in a streaming manner: "payroll_cycles" */
  payroll_cycles_stream: Array<Payroll_Cycles>;
  /** fetch data from the table: "payroll_date_types" */
  payroll_date_types: Array<Payroll_Date_Types>;
  /** fetch aggregated fields from the table: "payroll_date_types" */
  payroll_date_types_aggregate: Payroll_Date_Types_Aggregate;
  /** fetch data from the table: "payroll_date_types" using primary key columns */
  payroll_date_types_by_pk: Maybe<Payroll_Date_Types>;
  /** fetch data from the table in a streaming manner: "payroll_date_types" */
  payroll_date_types_stream: Array<Payroll_Date_Types>;
  /** An array relationship */
  payroll_dates: Array<Payroll_Dates>;
  /** An aggregate relationship */
  payroll_dates_aggregate: Payroll_Dates_Aggregate;
  /** fetch data from the table: "payroll_dates" using primary key columns */
  payroll_dates_by_pk: Maybe<Payroll_Dates>;
  /** fetch data from the table in a streaming manner: "payroll_dates" */
  payroll_dates_stream: Array<Payroll_Dates>;
  /** fetch data from the table: "payroll_version_history_results" */
  payroll_version_history_results: Array<Payroll_Version_History_Results>;
  /** fetch aggregated fields from the table: "payroll_version_history_results" */
  payroll_version_history_results_aggregate: Payroll_Version_History_Results_Aggregate;
  /** fetch data from the table: "payroll_version_history_results" using primary key columns */
  payroll_version_history_results_by_pk: Maybe<Payroll_Version_History_Results>;
  /** fetch data from the table in a streaming manner: "payroll_version_history_results" */
  payroll_version_history_results_stream: Array<Payroll_Version_History_Results>;
  /** fetch data from the table: "payroll_version_results" */
  payroll_version_results: Array<Payroll_Version_Results>;
  /** fetch aggregated fields from the table: "payroll_version_results" */
  payroll_version_results_aggregate: Payroll_Version_Results_Aggregate;
  /** fetch data from the table: "payroll_version_results" using primary key columns */
  payroll_version_results_by_pk: Maybe<Payroll_Version_Results>;
  /** fetch data from the table in a streaming manner: "payroll_version_results" */
  payroll_version_results_stream: Array<Payroll_Version_Results>;
  /** An array relationship */
  payrolls: Array<Payrolls>;
  /** An aggregate relationship */
  payrolls_aggregate: Payrolls_Aggregate;
  /** fetch data from the table: "payrolls" using primary key columns */
  payrolls_by_pk: Maybe<Payrolls>;
  /** fetch data from the table in a streaming manner: "payrolls" */
  payrolls_stream: Array<Payrolls>;
  /** An array relationship */
  permissions: Array<Permissions>;
  /** An aggregate relationship */
  permissions_aggregate: Permissions_Aggregate;
  /** fetch data from the table: "permissions" using primary key columns */
  permissions_by_pk: Maybe<Permissions>;
  /** fetch data from the table in a streaming manner: "permissions" */
  permissions_stream: Array<Permissions>;
  /** fetch data from the table: "resources" */
  resources: Array<Resources>;
  /** fetch aggregated fields from the table: "resources" */
  resources_aggregate: Resources_Aggregate;
  /** fetch data from the table: "resources" using primary key columns */
  resources_by_pk: Maybe<Resources>;
  /** fetch data from the table in a streaming manner: "resources" */
  resources_stream: Array<Resources>;
  /** An array relationship */
  role_permissions: Array<Role_Permissions>;
  /** An aggregate relationship */
  role_permissions_aggregate: Role_Permissions_Aggregate;
  /** fetch data from the table: "role_permissions" using primary key columns */
  role_permissions_by_pk: Maybe<Role_Permissions>;
  /** fetch data from the table in a streaming manner: "role_permissions" */
  role_permissions_stream: Array<Role_Permissions>;
  /** fetch data from the table: "roles" */
  roles: Array<Roles>;
  /** fetch aggregated fields from the table: "roles" */
  roles_aggregate: Roles_Aggregate;
  /** fetch data from the table: "roles" using primary key columns */
  roles_by_pk: Maybe<Roles>;
  /** fetch data from the table in a streaming manner: "roles" */
  roles_stream: Array<Roles>;
  /** An array relationship */
  user_roles: Array<User_Roles>;
  /** An aggregate relationship */
  user_roles_aggregate: User_Roles_Aggregate;
  /** fetch data from the table: "user_roles" using primary key columns */
  user_roles_by_pk: Maybe<User_Roles>;
  /** fetch data from the table in a streaming manner: "user_roles" */
  user_roles_stream: Array<User_Roles>;
  /** fetch data from the table: "users" */
  users: Array<Users>;
  /** fetch aggregated fields from the table: "users" */
  users_aggregate: Users_Aggregate;
  /** fetch data from the table: "users" using primary key columns */
  users_by_pk: Maybe<Users>;
  /** fetch data from the table: "users_role_backup" */
  users_role_backup: Array<Users_Role_Backup>;
  /** fetch aggregated fields from the table: "users_role_backup" */
  users_role_backup_aggregate: Users_Role_Backup_Aggregate;
  /** fetch data from the table in a streaming manner: "users_role_backup" */
  users_role_backup_stream: Array<Users_Role_Backup>;
  /** fetch data from the table in a streaming manner: "users" */
  users_stream: Array<Users>;
  /** fetch data from the table: "work_schedule" */
  work_schedule: Array<Work_Schedule>;
  /** fetch aggregated fields from the table: "work_schedule" */
  work_schedule_aggregate: Work_Schedule_Aggregate;
  /** fetch data from the table: "work_schedule" using primary key columns */
  work_schedule_by_pk: Maybe<Work_Schedule>;
  /** fetch data from the table in a streaming manner: "work_schedule" */
  work_schedule_stream: Array<Work_Schedule>;
};

export type Subscription_RootAdjustment_RulesArgs = {
  distinct_on?: InputMaybe<Array<Adjustment_Rules_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Adjustment_Rules_Order_By>>;
  where?: InputMaybe<Adjustment_Rules_Bool_Exp>;
};

export type Subscription_RootAdjustment_Rules_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Adjustment_Rules_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Adjustment_Rules_Order_By>>;
  where?: InputMaybe<Adjustment_Rules_Bool_Exp>;
};

export type Subscription_RootAdjustment_Rules_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootAdjustment_Rules_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Adjustment_Rules_Stream_Cursor_Input>>;
  where?: InputMaybe<Adjustment_Rules_Bool_Exp>;
};

export type Subscription_RootApp_SettingsArgs = {
  distinct_on?: InputMaybe<Array<App_Settings_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<App_Settings_Order_By>>;
  where?: InputMaybe<App_Settings_Bool_Exp>;
};

export type Subscription_RootApp_Settings_AggregateArgs = {
  distinct_on?: InputMaybe<Array<App_Settings_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<App_Settings_Order_By>>;
  where?: InputMaybe<App_Settings_Bool_Exp>;
};

export type Subscription_RootApp_Settings_By_PkArgs = {
  id: Scalars["String"]["input"];
};

export type Subscription_RootApp_Settings_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<App_Settings_Stream_Cursor_Input>>;
  where?: InputMaybe<App_Settings_Bool_Exp>;
};

export type Subscription_RootBilling_Event_LogArgs = {
  distinct_on?: InputMaybe<Array<Billing_Event_Log_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Billing_Event_Log_Order_By>>;
  where?: InputMaybe<Billing_Event_Log_Bool_Exp>;
};

export type Subscription_RootBilling_Event_Log_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Billing_Event_Log_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Billing_Event_Log_Order_By>>;
  where?: InputMaybe<Billing_Event_Log_Bool_Exp>;
};

export type Subscription_RootBilling_Event_Log_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootBilling_Event_Log_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Billing_Event_Log_Stream_Cursor_Input>>;
  where?: InputMaybe<Billing_Event_Log_Bool_Exp>;
};

export type Subscription_RootBilling_InvoiceArgs = {
  distinct_on?: InputMaybe<Array<Billing_Invoice_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Billing_Invoice_Order_By>>;
  where?: InputMaybe<Billing_Invoice_Bool_Exp>;
};

export type Subscription_RootBilling_Invoice_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Billing_Invoice_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Billing_Invoice_Order_By>>;
  where?: InputMaybe<Billing_Invoice_Bool_Exp>;
};

export type Subscription_RootBilling_Invoice_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootBilling_Invoice_ItemArgs = {
  distinct_on?: InputMaybe<Array<Billing_Invoice_Item_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Billing_Invoice_Item_Order_By>>;
  where?: InputMaybe<Billing_Invoice_Item_Bool_Exp>;
};

export type Subscription_RootBilling_Invoice_Item_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Billing_Invoice_Item_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Billing_Invoice_Item_Order_By>>;
  where?: InputMaybe<Billing_Invoice_Item_Bool_Exp>;
};

export type Subscription_RootBilling_Invoice_Item_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootBilling_Invoice_Item_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Billing_Invoice_Item_Stream_Cursor_Input>>;
  where?: InputMaybe<Billing_Invoice_Item_Bool_Exp>;
};

export type Subscription_RootBilling_Invoice_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Billing_Invoice_Stream_Cursor_Input>>;
  where?: InputMaybe<Billing_Invoice_Bool_Exp>;
};

export type Subscription_RootBilling_InvoicesArgs = {
  distinct_on?: InputMaybe<Array<Billing_Invoices_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Billing_Invoices_Order_By>>;
  where?: InputMaybe<Billing_Invoices_Bool_Exp>;
};

export type Subscription_RootBilling_Invoices_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Billing_Invoices_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Billing_Invoices_Order_By>>;
  where?: InputMaybe<Billing_Invoices_Bool_Exp>;
};

export type Subscription_RootBilling_Invoices_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootBilling_Invoices_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Billing_Invoices_Stream_Cursor_Input>>;
  where?: InputMaybe<Billing_Invoices_Bool_Exp>;
};

export type Subscription_RootBilling_ItemsArgs = {
  distinct_on?: InputMaybe<Array<Billing_Items_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Billing_Items_Order_By>>;
  where?: InputMaybe<Billing_Items_Bool_Exp>;
};

export type Subscription_RootBilling_Items_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Billing_Items_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Billing_Items_Order_By>>;
  where?: InputMaybe<Billing_Items_Bool_Exp>;
};

export type Subscription_RootBilling_Items_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootBilling_Items_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Billing_Items_Stream_Cursor_Input>>;
  where?: InputMaybe<Billing_Items_Bool_Exp>;
};

export type Subscription_RootBilling_PlanArgs = {
  distinct_on?: InputMaybe<Array<Billing_Plan_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Billing_Plan_Order_By>>;
  where?: InputMaybe<Billing_Plan_Bool_Exp>;
};

export type Subscription_RootBilling_Plan_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Billing_Plan_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Billing_Plan_Order_By>>;
  where?: InputMaybe<Billing_Plan_Bool_Exp>;
};

export type Subscription_RootBilling_Plan_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootBilling_Plan_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Billing_Plan_Stream_Cursor_Input>>;
  where?: InputMaybe<Billing_Plan_Bool_Exp>;
};

export type Subscription_RootClient_Billing_AssignmentArgs = {
  distinct_on?: InputMaybe<Array<Client_Billing_Assignment_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Client_Billing_Assignment_Order_By>>;
  where?: InputMaybe<Client_Billing_Assignment_Bool_Exp>;
};

export type Subscription_RootClient_Billing_Assignment_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Client_Billing_Assignment_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Client_Billing_Assignment_Order_By>>;
  where?: InputMaybe<Client_Billing_Assignment_Bool_Exp>;
};

export type Subscription_RootClient_Billing_Assignment_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootClient_Billing_Assignment_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Client_Billing_Assignment_Stream_Cursor_Input>>;
  where?: InputMaybe<Client_Billing_Assignment_Bool_Exp>;
};

export type Subscription_RootClient_External_SystemsArgs = {
  distinct_on?: InputMaybe<Array<Client_External_Systems_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Client_External_Systems_Order_By>>;
  where?: InputMaybe<Client_External_Systems_Bool_Exp>;
};

export type Subscription_RootClient_External_Systems_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Client_External_Systems_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Client_External_Systems_Order_By>>;
  where?: InputMaybe<Client_External_Systems_Bool_Exp>;
};

export type Subscription_RootClient_External_Systems_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootClient_External_Systems_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Client_External_Systems_Stream_Cursor_Input>>;
  where?: InputMaybe<Client_External_Systems_Bool_Exp>;
};

export type Subscription_RootClientsArgs = {
  distinct_on?: InputMaybe<Array<Clients_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Clients_Order_By>>;
  where?: InputMaybe<Clients_Bool_Exp>;
};

export type Subscription_RootClients_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Clients_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Clients_Order_By>>;
  where?: InputMaybe<Clients_Bool_Exp>;
};

export type Subscription_RootClients_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootClients_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Clients_Stream_Cursor_Input>>;
  where?: InputMaybe<Clients_Bool_Exp>;
};

export type Subscription_RootCreate_Payroll_VersionArgs = {
  args: Create_Payroll_Version_Args;
  distinct_on?: InputMaybe<Array<Payroll_Version_Results_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payroll_Version_Results_Order_By>>;
  where?: InputMaybe<Payroll_Version_Results_Bool_Exp>;
};

export type Subscription_RootCreate_Payroll_Version_AggregateArgs = {
  args: Create_Payroll_Version_Args;
  distinct_on?: InputMaybe<Array<Payroll_Version_Results_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payroll_Version_Results_Order_By>>;
  where?: InputMaybe<Payroll_Version_Results_Bool_Exp>;
};

export type Subscription_RootCurrent_PayrollsArgs = {
  distinct_on?: InputMaybe<Array<Current_Payrolls_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Current_Payrolls_Order_By>>;
  where?: InputMaybe<Current_Payrolls_Bool_Exp>;
};

export type Subscription_RootCurrent_Payrolls_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Current_Payrolls_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Current_Payrolls_Order_By>>;
  where?: InputMaybe<Current_Payrolls_Bool_Exp>;
};

export type Subscription_RootCurrent_Payrolls_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Current_Payrolls_Stream_Cursor_Input>>;
  where?: InputMaybe<Current_Payrolls_Bool_Exp>;
};

export type Subscription_RootExternal_SystemsArgs = {
  distinct_on?: InputMaybe<Array<External_Systems_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<External_Systems_Order_By>>;
  where?: InputMaybe<External_Systems_Bool_Exp>;
};

export type Subscription_RootExternal_Systems_AggregateArgs = {
  distinct_on?: InputMaybe<Array<External_Systems_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<External_Systems_Order_By>>;
  where?: InputMaybe<External_Systems_Bool_Exp>;
};

export type Subscription_RootExternal_Systems_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootExternal_Systems_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<External_Systems_Stream_Cursor_Input>>;
  where?: InputMaybe<External_Systems_Bool_Exp>;
};

export type Subscription_RootFeature_FlagsArgs = {
  distinct_on?: InputMaybe<Array<Feature_Flags_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Feature_Flags_Order_By>>;
  where?: InputMaybe<Feature_Flags_Bool_Exp>;
};

export type Subscription_RootFeature_Flags_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Feature_Flags_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Feature_Flags_Order_By>>;
  where?: InputMaybe<Feature_Flags_Bool_Exp>;
};

export type Subscription_RootFeature_Flags_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootFeature_Flags_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Feature_Flags_Stream_Cursor_Input>>;
  where?: InputMaybe<Feature_Flags_Bool_Exp>;
};

export type Subscription_RootGenerate_Payroll_DatesArgs = {
  args: Generate_Payroll_Dates_Args;
  distinct_on?: InputMaybe<Array<Payroll_Dates_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payroll_Dates_Order_By>>;
  where?: InputMaybe<Payroll_Dates_Bool_Exp>;
};

export type Subscription_RootGenerate_Payroll_Dates_AggregateArgs = {
  args: Generate_Payroll_Dates_Args;
  distinct_on?: InputMaybe<Array<Payroll_Dates_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payroll_Dates_Order_By>>;
  where?: InputMaybe<Payroll_Dates_Bool_Exp>;
};

export type Subscription_RootHolidaysArgs = {
  distinct_on?: InputMaybe<Array<Holidays_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Holidays_Order_By>>;
  where?: InputMaybe<Holidays_Bool_Exp>;
};

export type Subscription_RootHolidays_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Holidays_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Holidays_Order_By>>;
  where?: InputMaybe<Holidays_Bool_Exp>;
};

export type Subscription_RootHolidays_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootHolidays_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Holidays_Stream_Cursor_Input>>;
  where?: InputMaybe<Holidays_Bool_Exp>;
};

export type Subscription_RootLatest_Payroll_Version_ResultsArgs = {
  distinct_on?: InputMaybe<Array<Latest_Payroll_Version_Results_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Latest_Payroll_Version_Results_Order_By>>;
  where?: InputMaybe<Latest_Payroll_Version_Results_Bool_Exp>;
};

export type Subscription_RootLatest_Payroll_Version_Results_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Latest_Payroll_Version_Results_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Latest_Payroll_Version_Results_Order_By>>;
  where?: InputMaybe<Latest_Payroll_Version_Results_Bool_Exp>;
};

export type Subscription_RootLatest_Payroll_Version_Results_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootLatest_Payroll_Version_Results_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Latest_Payroll_Version_Results_Stream_Cursor_Input>>;
  where?: InputMaybe<Latest_Payroll_Version_Results_Bool_Exp>;
};

export type Subscription_RootLeaveArgs = {
  distinct_on?: InputMaybe<Array<Leave_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Leave_Order_By>>;
  where?: InputMaybe<Leave_Bool_Exp>;
};

export type Subscription_RootLeave_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Leave_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Leave_Order_By>>;
  where?: InputMaybe<Leave_Bool_Exp>;
};

export type Subscription_RootLeave_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootLeave_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Leave_Stream_Cursor_Input>>;
  where?: InputMaybe<Leave_Bool_Exp>;
};

export type Subscription_RootNeon_Auth_Users_SyncArgs = {
  distinct_on?: InputMaybe<Array<Neon_Auth_Users_Sync_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Neon_Auth_Users_Sync_Order_By>>;
  where?: InputMaybe<Neon_Auth_Users_Sync_Bool_Exp>;
};

export type Subscription_RootNeon_Auth_Users_Sync_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Neon_Auth_Users_Sync_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Neon_Auth_Users_Sync_Order_By>>;
  where?: InputMaybe<Neon_Auth_Users_Sync_Bool_Exp>;
};

export type Subscription_RootNeon_Auth_Users_Sync_By_PkArgs = {
  id: Scalars["String"]["input"];
};

export type Subscription_RootNeon_Auth_Users_Sync_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Neon_Auth_Users_Sync_Stream_Cursor_Input>>;
  where?: InputMaybe<Neon_Auth_Users_Sync_Bool_Exp>;
};

export type Subscription_RootNotesArgs = {
  distinct_on?: InputMaybe<Array<Notes_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Notes_Order_By>>;
  where?: InputMaybe<Notes_Bool_Exp>;
};

export type Subscription_RootNotes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Notes_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Notes_Order_By>>;
  where?: InputMaybe<Notes_Bool_Exp>;
};

export type Subscription_RootNotes_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootNotes_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Notes_Stream_Cursor_Input>>;
  where?: InputMaybe<Notes_Bool_Exp>;
};

export type Subscription_RootPayroll_Activation_ResultsArgs = {
  distinct_on?: InputMaybe<Array<Payroll_Activation_Results_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payroll_Activation_Results_Order_By>>;
  where?: InputMaybe<Payroll_Activation_Results_Bool_Exp>;
};

export type Subscription_RootPayroll_Activation_Results_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payroll_Activation_Results_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payroll_Activation_Results_Order_By>>;
  where?: InputMaybe<Payroll_Activation_Results_Bool_Exp>;
};

export type Subscription_RootPayroll_Activation_Results_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootPayroll_Activation_Results_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Payroll_Activation_Results_Stream_Cursor_Input>>;
  where?: InputMaybe<Payroll_Activation_Results_Bool_Exp>;
};

export type Subscription_RootPayroll_CyclesArgs = {
  distinct_on?: InputMaybe<Array<Payroll_Cycles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payroll_Cycles_Order_By>>;
  where?: InputMaybe<Payroll_Cycles_Bool_Exp>;
};

export type Subscription_RootPayroll_Cycles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payroll_Cycles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payroll_Cycles_Order_By>>;
  where?: InputMaybe<Payroll_Cycles_Bool_Exp>;
};

export type Subscription_RootPayroll_Cycles_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootPayroll_Cycles_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Payroll_Cycles_Stream_Cursor_Input>>;
  where?: InputMaybe<Payroll_Cycles_Bool_Exp>;
};

export type Subscription_RootPayroll_Date_TypesArgs = {
  distinct_on?: InputMaybe<Array<Payroll_Date_Types_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payroll_Date_Types_Order_By>>;
  where?: InputMaybe<Payroll_Date_Types_Bool_Exp>;
};

export type Subscription_RootPayroll_Date_Types_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payroll_Date_Types_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payroll_Date_Types_Order_By>>;
  where?: InputMaybe<Payroll_Date_Types_Bool_Exp>;
};

export type Subscription_RootPayroll_Date_Types_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootPayroll_Date_Types_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Payroll_Date_Types_Stream_Cursor_Input>>;
  where?: InputMaybe<Payroll_Date_Types_Bool_Exp>;
};

export type Subscription_RootPayroll_DatesArgs = {
  distinct_on?: InputMaybe<Array<Payroll_Dates_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payroll_Dates_Order_By>>;
  where?: InputMaybe<Payroll_Dates_Bool_Exp>;
};

export type Subscription_RootPayroll_Dates_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payroll_Dates_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payroll_Dates_Order_By>>;
  where?: InputMaybe<Payroll_Dates_Bool_Exp>;
};

export type Subscription_RootPayroll_Dates_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootPayroll_Dates_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Payroll_Dates_Stream_Cursor_Input>>;
  where?: InputMaybe<Payroll_Dates_Bool_Exp>;
};

export type Subscription_RootPayroll_Version_History_ResultsArgs = {
  distinct_on?: InputMaybe<
    Array<Payroll_Version_History_Results_Select_Column>
  >;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payroll_Version_History_Results_Order_By>>;
  where?: InputMaybe<Payroll_Version_History_Results_Bool_Exp>;
};

export type Subscription_RootPayroll_Version_History_Results_AggregateArgs = {
  distinct_on?: InputMaybe<
    Array<Payroll_Version_History_Results_Select_Column>
  >;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payroll_Version_History_Results_Order_By>>;
  where?: InputMaybe<Payroll_Version_History_Results_Bool_Exp>;
};

export type Subscription_RootPayroll_Version_History_Results_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootPayroll_Version_History_Results_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<
    InputMaybe<Payroll_Version_History_Results_Stream_Cursor_Input>
  >;
  where?: InputMaybe<Payroll_Version_History_Results_Bool_Exp>;
};

export type Subscription_RootPayroll_Version_ResultsArgs = {
  distinct_on?: InputMaybe<Array<Payroll_Version_Results_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payroll_Version_Results_Order_By>>;
  where?: InputMaybe<Payroll_Version_Results_Bool_Exp>;
};

export type Subscription_RootPayroll_Version_Results_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payroll_Version_Results_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payroll_Version_Results_Order_By>>;
  where?: InputMaybe<Payroll_Version_Results_Bool_Exp>;
};

export type Subscription_RootPayroll_Version_Results_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootPayroll_Version_Results_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Payroll_Version_Results_Stream_Cursor_Input>>;
  where?: InputMaybe<Payroll_Version_Results_Bool_Exp>;
};

export type Subscription_RootPayrollsArgs = {
  distinct_on?: InputMaybe<Array<Payrolls_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payrolls_Order_By>>;
  where?: InputMaybe<Payrolls_Bool_Exp>;
};

export type Subscription_RootPayrolls_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payrolls_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payrolls_Order_By>>;
  where?: InputMaybe<Payrolls_Bool_Exp>;
};

export type Subscription_RootPayrolls_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootPayrolls_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Payrolls_Stream_Cursor_Input>>;
  where?: InputMaybe<Payrolls_Bool_Exp>;
};

export type Subscription_RootPermissionsArgs = {
  distinct_on?: InputMaybe<Array<Permissions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Permissions_Order_By>>;
  where?: InputMaybe<Permissions_Bool_Exp>;
};

export type Subscription_RootPermissions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Permissions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Permissions_Order_By>>;
  where?: InputMaybe<Permissions_Bool_Exp>;
};

export type Subscription_RootPermissions_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootPermissions_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Permissions_Stream_Cursor_Input>>;
  where?: InputMaybe<Permissions_Bool_Exp>;
};

export type Subscription_RootResourcesArgs = {
  distinct_on?: InputMaybe<Array<Resources_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Resources_Order_By>>;
  where?: InputMaybe<Resources_Bool_Exp>;
};

export type Subscription_RootResources_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Resources_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Resources_Order_By>>;
  where?: InputMaybe<Resources_Bool_Exp>;
};

export type Subscription_RootResources_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootResources_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Resources_Stream_Cursor_Input>>;
  where?: InputMaybe<Resources_Bool_Exp>;
};

export type Subscription_RootRole_PermissionsArgs = {
  distinct_on?: InputMaybe<Array<Role_Permissions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Role_Permissions_Order_By>>;
  where?: InputMaybe<Role_Permissions_Bool_Exp>;
};

export type Subscription_RootRole_Permissions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Role_Permissions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Role_Permissions_Order_By>>;
  where?: InputMaybe<Role_Permissions_Bool_Exp>;
};

export type Subscription_RootRole_Permissions_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootRole_Permissions_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Role_Permissions_Stream_Cursor_Input>>;
  where?: InputMaybe<Role_Permissions_Bool_Exp>;
};

export type Subscription_RootRolesArgs = {
  distinct_on?: InputMaybe<Array<Roles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Roles_Order_By>>;
  where?: InputMaybe<Roles_Bool_Exp>;
};

export type Subscription_RootRoles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Roles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Roles_Order_By>>;
  where?: InputMaybe<Roles_Bool_Exp>;
};

export type Subscription_RootRoles_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootRoles_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Roles_Stream_Cursor_Input>>;
  where?: InputMaybe<Roles_Bool_Exp>;
};

export type Subscription_RootUser_RolesArgs = {
  distinct_on?: InputMaybe<Array<User_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<User_Roles_Order_By>>;
  where?: InputMaybe<User_Roles_Bool_Exp>;
};

export type Subscription_RootUser_Roles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<User_Roles_Order_By>>;
  where?: InputMaybe<User_Roles_Bool_Exp>;
};

export type Subscription_RootUser_Roles_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootUser_Roles_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<User_Roles_Stream_Cursor_Input>>;
  where?: InputMaybe<User_Roles_Bool_Exp>;
};

export type Subscription_RootUsersArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};

export type Subscription_RootUsers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};

export type Subscription_RootUsers_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootUsers_Role_BackupArgs = {
  distinct_on?: InputMaybe<Array<Users_Role_Backup_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Users_Role_Backup_Order_By>>;
  where?: InputMaybe<Users_Role_Backup_Bool_Exp>;
};

export type Subscription_RootUsers_Role_Backup_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Role_Backup_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Users_Role_Backup_Order_By>>;
  where?: InputMaybe<Users_Role_Backup_Bool_Exp>;
};

export type Subscription_RootUsers_Role_Backup_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Users_Role_Backup_Stream_Cursor_Input>>;
  where?: InputMaybe<Users_Role_Backup_Bool_Exp>;
};

export type Subscription_RootUsers_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Users_Stream_Cursor_Input>>;
  where?: InputMaybe<Users_Bool_Exp>;
};

export type Subscription_RootWork_ScheduleArgs = {
  distinct_on?: InputMaybe<Array<Work_Schedule_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Work_Schedule_Order_By>>;
  where?: InputMaybe<Work_Schedule_Bool_Exp>;
};

export type Subscription_RootWork_Schedule_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Work_Schedule_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Work_Schedule_Order_By>>;
  where?: InputMaybe<Work_Schedule_Bool_Exp>;
};

export type Subscription_RootWork_Schedule_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootWork_Schedule_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Work_Schedule_Stream_Cursor_Input>>;
  where?: InputMaybe<Work_Schedule_Bool_Exp>;
};

/** Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'. */
export type Timestamp_Comparison_Exp = {
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
export type Timestamptz_Comparison_Exp = {
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
export type User_Role_Comparison_Exp = {
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
export type User_Roles = {
  __typename: "user_roles";
  created_at: Scalars["timestamptz"]["output"];
  id: Scalars["uuid"]["output"];
  /** An object relationship */
  role: Roles;
  role_id: Scalars["uuid"]["output"];
  updated_at: Scalars["timestamptz"]["output"];
  /** An object relationship */
  user: Users;
  user_id: Scalars["uuid"]["output"];
};

/** aggregated selection of "user_roles" */
export type User_Roles_Aggregate = {
  __typename: "user_roles_aggregate";
  aggregate: Maybe<User_Roles_Aggregate_Fields>;
  nodes: Array<User_Roles>;
};

export type User_Roles_Aggregate_Bool_Exp = {
  count?: InputMaybe<User_Roles_Aggregate_Bool_Exp_Count>;
};

export type User_Roles_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<User_Roles_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<User_Roles_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "user_roles" */
export type User_Roles_Aggregate_Fields = {
  __typename: "user_roles_aggregate_fields";
  count: Scalars["Int"]["output"];
  max: Maybe<User_Roles_Max_Fields>;
  min: Maybe<User_Roles_Min_Fields>;
};

/** aggregate fields of "user_roles" */
export type User_Roles_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<User_Roles_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "user_roles" */
export type User_Roles_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<User_Roles_Max_Order_By>;
  min?: InputMaybe<User_Roles_Min_Order_By>;
};

/** input type for inserting array relation for remote table "user_roles" */
export type User_Roles_Arr_Rel_Insert_Input = {
  data: Array<User_Roles_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<User_Roles_On_Conflict>;
};

/** Boolean expression to filter rows from the table "user_roles". All fields are combined with a logical 'AND'. */
export type User_Roles_Bool_Exp = {
  _and?: InputMaybe<Array<User_Roles_Bool_Exp>>;
  _not?: InputMaybe<User_Roles_Bool_Exp>;
  _or?: InputMaybe<Array<User_Roles_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  role?: InputMaybe<Roles_Bool_Exp>;
  role_id?: InputMaybe<Uuid_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "user_roles" */
export type User_Roles_Constraint =
  /** unique or primary key constraint on columns "id" */
  | "user_roles_pkey"
  /** unique or primary key constraint on columns "user_id", "role_id" */
  | "user_roles_user_id_role_id_key";

/** input type for inserting data into table "user_roles" */
export type User_Roles_Insert_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  role?: InputMaybe<Roles_Obj_Rel_Insert_Input>;
  role_id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type User_Roles_Max_Fields = {
  __typename: "user_roles_max_fields";
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  role_id: Maybe<Scalars["uuid"]["output"]>;
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
  user_id: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "user_roles" */
export type User_Roles_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  role_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type User_Roles_Min_Fields = {
  __typename: "user_roles_min_fields";
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  role_id: Maybe<Scalars["uuid"]["output"]>;
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
  user_id: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "user_roles" */
export type User_Roles_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  role_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "user_roles" */
export type User_Roles_Mutation_Response = {
  __typename: "user_roles_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<User_Roles>;
};

/** on_conflict condition type for table "user_roles" */
export type User_Roles_On_Conflict = {
  constraint: User_Roles_Constraint;
  update_columns?: Array<User_Roles_Update_Column>;
  where?: InputMaybe<User_Roles_Bool_Exp>;
};

/** Ordering options when selecting data from "user_roles". */
export type User_Roles_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  role?: InputMaybe<Roles_Order_By>;
  role_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: user_roles */
export type User_Roles_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "user_roles" */
export type User_Roles_Select_Column =
  /** column name */
  | "created_at"
  /** column name */
  | "id"
  /** column name */
  | "role_id"
  /** column name */
  | "updated_at"
  /** column name */
  | "user_id";

/** input type for updating data in table "user_roles" */
export type User_Roles_Set_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  role_id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** Streaming cursor of the table "user_roles" */
export type User_Roles_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: User_Roles_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type User_Roles_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  role_id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** update columns of table "user_roles" */
export type User_Roles_Update_Column =
  /** column name */
  | "created_at"
  /** column name */
  | "id"
  /** column name */
  | "role_id"
  /** column name */
  | "updated_at"
  /** column name */
  | "user_id";

export type User_Roles_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<User_Roles_Set_Input>;
  /** filter the rows which have to be updated */
  where: User_Roles_Bool_Exp;
};

/** columns and relationships of "users" */
export type Users = {
  __typename: "users";
  /** An array relationship */
  billing_event_logs: Array<Billing_Event_Log>;
  /** An aggregate relationship */
  billing_event_logs_aggregate: Billing_Event_Log_Aggregate;
  /** External identifier from Clerk authentication service */
  clerk_user_id: Maybe<Scalars["String"]["output"]>;
  /** Timestamp when the user was created */
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  deactivated_at: Maybe<Scalars["timestamptz"]["output"]>;
  deactivated_by: Maybe<Scalars["String"]["output"]>;
  /** User's email address (unique) */
  email: Scalars["String"]["output"];
  /** Unique identifier for the user */
  id: Scalars["uuid"]["output"];
  /** URL to the user's profile image */
  image: Maybe<Scalars["String"]["output"]>;
  is_active: Maybe<Scalars["Boolean"]["output"]>;
  /** Whether the user is a staff member (vs. external user) */
  is_staff: Maybe<Scalars["Boolean"]["output"]>;
  /** An array relationship */
  leaves: Array<Leave>;
  /** An aggregate relationship */
  leaves_aggregate: Leave_Aggregate;
  /** An object relationship */
  manager: Maybe<Users>;
  /** Reference to the user's manager */
  manager_id: Maybe<Scalars["uuid"]["output"]>;
  /** User's full name */
  name: Scalars["String"]["output"];
  /** An array relationship */
  notes_written: Array<Notes>;
  /** An aggregate relationship */
  notes_written_aggregate: Notes_Aggregate;
  /** An array relationship */
  payrollsByBackupConsultantUserId: Array<Payrolls>;
  /** An aggregate relationship */
  payrollsByBackupConsultantUserId_aggregate: Payrolls_Aggregate;
  /** An array relationship */
  payrollsByManagerUserId: Array<Payrolls>;
  /** An aggregate relationship */
  payrollsByManagerUserId_aggregate: Payrolls_Aggregate;
  /** An array relationship */
  payrollsByPrimaryConsultantUserId: Array<Payrolls>;
  /** An aggregate relationship */
  payrollsByPrimaryConsultantUserId_aggregate: Payrolls_Aggregate;
  /** User's system role (viewer, consultant, manager, org_admin) */
  role: Scalars["user_role"]["output"];
  /** An array relationship */
  staffByManager: Array<Users>;
  /** An aggregate relationship */
  staffByManager_aggregate: Users_Aggregate;
  /** Timestamp when the user was last updated */
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
  /** An array relationship */
  user_roles: Array<User_Roles>;
  /** An aggregate relationship */
  user_roles_aggregate: User_Roles_Aggregate;
  /** User's unique username for login */
  username: Maybe<Scalars["String"]["output"]>;
  /** An array relationship */
  usersManager: Array<Users>;
  /** An aggregate relationship */
  usersManager_aggregate: Users_Aggregate;
  /** An array relationship */
  work_schedules: Array<Work_Schedule>;
  /** An aggregate relationship */
  work_schedules_aggregate: Work_Schedule_Aggregate;
};

/** columns and relationships of "users" */
export type UsersBilling_Event_LogsArgs = {
  distinct_on?: InputMaybe<Array<Billing_Event_Log_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Billing_Event_Log_Order_By>>;
  where?: InputMaybe<Billing_Event_Log_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersBilling_Event_Logs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Billing_Event_Log_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Billing_Event_Log_Order_By>>;
  where?: InputMaybe<Billing_Event_Log_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersLeavesArgs = {
  distinct_on?: InputMaybe<Array<Leave_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Leave_Order_By>>;
  where?: InputMaybe<Leave_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersLeaves_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Leave_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Leave_Order_By>>;
  where?: InputMaybe<Leave_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersNotes_WrittenArgs = {
  distinct_on?: InputMaybe<Array<Notes_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Notes_Order_By>>;
  where?: InputMaybe<Notes_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersNotes_Written_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Notes_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Notes_Order_By>>;
  where?: InputMaybe<Notes_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersPayrollsByBackupConsultantUserIdArgs = {
  distinct_on?: InputMaybe<Array<Payrolls_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payrolls_Order_By>>;
  where?: InputMaybe<Payrolls_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersPayrollsByBackupConsultantUserId_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payrolls_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payrolls_Order_By>>;
  where?: InputMaybe<Payrolls_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersPayrollsByManagerUserIdArgs = {
  distinct_on?: InputMaybe<Array<Payrolls_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payrolls_Order_By>>;
  where?: InputMaybe<Payrolls_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersPayrollsByManagerUserId_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payrolls_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payrolls_Order_By>>;
  where?: InputMaybe<Payrolls_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersPayrollsByPrimaryConsultantUserIdArgs = {
  distinct_on?: InputMaybe<Array<Payrolls_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payrolls_Order_By>>;
  where?: InputMaybe<Payrolls_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersPayrollsByPrimaryConsultantUserId_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payrolls_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payrolls_Order_By>>;
  where?: InputMaybe<Payrolls_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersStaffByManagerArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersStaffByManager_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersUser_RolesArgs = {
  distinct_on?: InputMaybe<Array<User_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<User_Roles_Order_By>>;
  where?: InputMaybe<User_Roles_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersUser_Roles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<User_Roles_Order_By>>;
  where?: InputMaybe<User_Roles_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersUsersManagerArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersUsersManager_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersWork_SchedulesArgs = {
  distinct_on?: InputMaybe<Array<Work_Schedule_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Work_Schedule_Order_By>>;
  where?: InputMaybe<Work_Schedule_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersWork_Schedules_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Work_Schedule_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Work_Schedule_Order_By>>;
  where?: InputMaybe<Work_Schedule_Bool_Exp>;
};

/** aggregated selection of "users" */
export type Users_Aggregate = {
  __typename: "users_aggregate";
  aggregate: Maybe<Users_Aggregate_Fields>;
  nodes: Array<Users>;
};

export type Users_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Users_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Users_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Users_Aggregate_Bool_Exp_Count>;
};

export type Users_Aggregate_Bool_Exp_Bool_And = {
  arguments: Users_Select_Column_Users_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Users_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Users_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Users_Select_Column_Users_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Users_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Users_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Users_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Users_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "users" */
export type Users_Aggregate_Fields = {
  __typename: "users_aggregate_fields";
  count: Scalars["Int"]["output"];
  max: Maybe<Users_Max_Fields>;
  min: Maybe<Users_Min_Fields>;
};

/** aggregate fields of "users" */
export type Users_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Users_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "users" */
export type Users_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Users_Max_Order_By>;
  min?: InputMaybe<Users_Min_Order_By>;
};

/** input type for inserting array relation for remote table "users" */
export type Users_Arr_Rel_Insert_Input = {
  data: Array<Users_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Users_On_Conflict>;
};

/** Boolean expression to filter rows from the table "users". All fields are combined with a logical 'AND'. */
export type Users_Bool_Exp = {
  _and?: InputMaybe<Array<Users_Bool_Exp>>;
  _not?: InputMaybe<Users_Bool_Exp>;
  _or?: InputMaybe<Array<Users_Bool_Exp>>;
  billing_event_logs?: InputMaybe<Billing_Event_Log_Bool_Exp>;
  billing_event_logs_aggregate?: InputMaybe<Billing_Event_Log_Aggregate_Bool_Exp>;
  clerk_user_id?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  deactivated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  deactivated_by?: InputMaybe<String_Comparison_Exp>;
  email?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  image?: InputMaybe<String_Comparison_Exp>;
  is_active?: InputMaybe<Boolean_Comparison_Exp>;
  is_staff?: InputMaybe<Boolean_Comparison_Exp>;
  leaves?: InputMaybe<Leave_Bool_Exp>;
  leaves_aggregate?: InputMaybe<Leave_Aggregate_Bool_Exp>;
  manager?: InputMaybe<Users_Bool_Exp>;
  manager_id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  notes_written?: InputMaybe<Notes_Bool_Exp>;
  notes_written_aggregate?: InputMaybe<Notes_Aggregate_Bool_Exp>;
  payrollsByBackupConsultantUserId?: InputMaybe<Payrolls_Bool_Exp>;
  payrollsByBackupConsultantUserId_aggregate?: InputMaybe<Payrolls_Aggregate_Bool_Exp>;
  payrollsByManagerUserId?: InputMaybe<Payrolls_Bool_Exp>;
  payrollsByManagerUserId_aggregate?: InputMaybe<Payrolls_Aggregate_Bool_Exp>;
  payrollsByPrimaryConsultantUserId?: InputMaybe<Payrolls_Bool_Exp>;
  payrollsByPrimaryConsultantUserId_aggregate?: InputMaybe<Payrolls_Aggregate_Bool_Exp>;
  role?: InputMaybe<User_Role_Comparison_Exp>;
  staffByManager?: InputMaybe<Users_Bool_Exp>;
  staffByManager_aggregate?: InputMaybe<Users_Aggregate_Bool_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  user_roles?: InputMaybe<User_Roles_Bool_Exp>;
  user_roles_aggregate?: InputMaybe<User_Roles_Aggregate_Bool_Exp>;
  username?: InputMaybe<String_Comparison_Exp>;
  usersManager?: InputMaybe<Users_Bool_Exp>;
  usersManager_aggregate?: InputMaybe<Users_Aggregate_Bool_Exp>;
  work_schedules?: InputMaybe<Work_Schedule_Bool_Exp>;
  work_schedules_aggregate?: InputMaybe<Work_Schedule_Aggregate_Bool_Exp>;
};

/** unique or primary key constraints on table "users" */
export type Users_Constraint =
  /** unique or primary key constraint on columns "clerk_user_id" */
  | "users_clerk_user_id_key"
  /** unique or primary key constraint on columns "email" */
  | "users_email_key"
  /** unique or primary key constraint on columns "id" */
  | "users_pkey"
  /** unique or primary key constraint on columns "username" */
  | "users_username_key";

/** input type for inserting data into table "users" */
export type Users_Insert_Input = {
  billing_event_logs?: InputMaybe<Billing_Event_Log_Arr_Rel_Insert_Input>;
  /** External identifier from Clerk authentication service */
  clerk_user_id?: InputMaybe<Scalars["String"]["input"]>;
  /** Timestamp when the user was created */
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  deactivated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  deactivated_by?: InputMaybe<Scalars["String"]["input"]>;
  /** User's email address (unique) */
  email?: InputMaybe<Scalars["String"]["input"]>;
  /** Unique identifier for the user */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** URL to the user's profile image */
  image?: InputMaybe<Scalars["String"]["input"]>;
  is_active?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Whether the user is a staff member (vs. external user) */
  is_staff?: InputMaybe<Scalars["Boolean"]["input"]>;
  leaves?: InputMaybe<Leave_Arr_Rel_Insert_Input>;
  manager?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  /** Reference to the user's manager */
  manager_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** User's full name */
  name?: InputMaybe<Scalars["String"]["input"]>;
  notes_written?: InputMaybe<Notes_Arr_Rel_Insert_Input>;
  payrollsByBackupConsultantUserId?: InputMaybe<Payrolls_Arr_Rel_Insert_Input>;
  payrollsByManagerUserId?: InputMaybe<Payrolls_Arr_Rel_Insert_Input>;
  payrollsByPrimaryConsultantUserId?: InputMaybe<Payrolls_Arr_Rel_Insert_Input>;
  /** User's system role (viewer, consultant, manager, org_admin) */
  role?: InputMaybe<Scalars["user_role"]["input"]>;
  staffByManager?: InputMaybe<Users_Arr_Rel_Insert_Input>;
  /** Timestamp when the user was last updated */
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user_roles?: InputMaybe<User_Roles_Arr_Rel_Insert_Input>;
  /** User's unique username for login */
  username?: InputMaybe<Scalars["String"]["input"]>;
  usersManager?: InputMaybe<Users_Arr_Rel_Insert_Input>;
  work_schedules?: InputMaybe<Work_Schedule_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Users_Max_Fields = {
  __typename: "users_max_fields";
  /** External identifier from Clerk authentication service */
  clerk_user_id: Maybe<Scalars["String"]["output"]>;
  /** Timestamp when the user was created */
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  deactivated_at: Maybe<Scalars["timestamptz"]["output"]>;
  deactivated_by: Maybe<Scalars["String"]["output"]>;
  /** User's email address (unique) */
  email: Maybe<Scalars["String"]["output"]>;
  /** Unique identifier for the user */
  id: Maybe<Scalars["uuid"]["output"]>;
  /** URL to the user's profile image */
  image: Maybe<Scalars["String"]["output"]>;
  /** Reference to the user's manager */
  manager_id: Maybe<Scalars["uuid"]["output"]>;
  /** User's full name */
  name: Maybe<Scalars["String"]["output"]>;
  /** User's system role (viewer, consultant, manager, org_admin) */
  role: Maybe<Scalars["user_role"]["output"]>;
  /** Timestamp when the user was last updated */
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
  /** User's unique username for login */
  username: Maybe<Scalars["String"]["output"]>;
};

/** order by max() on columns of table "users" */
export type Users_Max_Order_By = {
  /** External identifier from Clerk authentication service */
  clerk_user_id?: InputMaybe<Order_By>;
  /** Timestamp when the user was created */
  created_at?: InputMaybe<Order_By>;
  deactivated_at?: InputMaybe<Order_By>;
  deactivated_by?: InputMaybe<Order_By>;
  /** User's email address (unique) */
  email?: InputMaybe<Order_By>;
  /** Unique identifier for the user */
  id?: InputMaybe<Order_By>;
  /** URL to the user's profile image */
  image?: InputMaybe<Order_By>;
  /** Reference to the user's manager */
  manager_id?: InputMaybe<Order_By>;
  /** User's full name */
  name?: InputMaybe<Order_By>;
  /** User's system role (viewer, consultant, manager, org_admin) */
  role?: InputMaybe<Order_By>;
  /** Timestamp when the user was last updated */
  updated_at?: InputMaybe<Order_By>;
  /** User's unique username for login */
  username?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Users_Min_Fields = {
  __typename: "users_min_fields";
  /** External identifier from Clerk authentication service */
  clerk_user_id: Maybe<Scalars["String"]["output"]>;
  /** Timestamp when the user was created */
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  deactivated_at: Maybe<Scalars["timestamptz"]["output"]>;
  deactivated_by: Maybe<Scalars["String"]["output"]>;
  /** User's email address (unique) */
  email: Maybe<Scalars["String"]["output"]>;
  /** Unique identifier for the user */
  id: Maybe<Scalars["uuid"]["output"]>;
  /** URL to the user's profile image */
  image: Maybe<Scalars["String"]["output"]>;
  /** Reference to the user's manager */
  manager_id: Maybe<Scalars["uuid"]["output"]>;
  /** User's full name */
  name: Maybe<Scalars["String"]["output"]>;
  /** User's system role (viewer, consultant, manager, org_admin) */
  role: Maybe<Scalars["user_role"]["output"]>;
  /** Timestamp when the user was last updated */
  updated_at: Maybe<Scalars["timestamptz"]["output"]>;
  /** User's unique username for login */
  username: Maybe<Scalars["String"]["output"]>;
};

/** order by min() on columns of table "users" */
export type Users_Min_Order_By = {
  /** External identifier from Clerk authentication service */
  clerk_user_id?: InputMaybe<Order_By>;
  /** Timestamp when the user was created */
  created_at?: InputMaybe<Order_By>;
  deactivated_at?: InputMaybe<Order_By>;
  deactivated_by?: InputMaybe<Order_By>;
  /** User's email address (unique) */
  email?: InputMaybe<Order_By>;
  /** Unique identifier for the user */
  id?: InputMaybe<Order_By>;
  /** URL to the user's profile image */
  image?: InputMaybe<Order_By>;
  /** Reference to the user's manager */
  manager_id?: InputMaybe<Order_By>;
  /** User's full name */
  name?: InputMaybe<Order_By>;
  /** User's system role (viewer, consultant, manager, org_admin) */
  role?: InputMaybe<Order_By>;
  /** Timestamp when the user was last updated */
  updated_at?: InputMaybe<Order_By>;
  /** User's unique username for login */
  username?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "users" */
export type Users_Mutation_Response = {
  __typename: "users_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Users>;
};

/** input type for inserting object relation for remote table "users" */
export type Users_Obj_Rel_Insert_Input = {
  data: Users_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Users_On_Conflict>;
};

/** on_conflict condition type for table "users" */
export type Users_On_Conflict = {
  constraint: Users_Constraint;
  update_columns?: Array<Users_Update_Column>;
  where?: InputMaybe<Users_Bool_Exp>;
};

/** Ordering options when selecting data from "users". */
export type Users_Order_By = {
  billing_event_logs_aggregate?: InputMaybe<Billing_Event_Log_Aggregate_Order_By>;
  clerk_user_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  deactivated_at?: InputMaybe<Order_By>;
  deactivated_by?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  image?: InputMaybe<Order_By>;
  is_active?: InputMaybe<Order_By>;
  is_staff?: InputMaybe<Order_By>;
  leaves_aggregate?: InputMaybe<Leave_Aggregate_Order_By>;
  manager?: InputMaybe<Users_Order_By>;
  manager_id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  notes_written_aggregate?: InputMaybe<Notes_Aggregate_Order_By>;
  payrollsByBackupConsultantUserId_aggregate?: InputMaybe<Payrolls_Aggregate_Order_By>;
  payrollsByManagerUserId_aggregate?: InputMaybe<Payrolls_Aggregate_Order_By>;
  payrollsByPrimaryConsultantUserId_aggregate?: InputMaybe<Payrolls_Aggregate_Order_By>;
  role?: InputMaybe<Order_By>;
  staffByManager_aggregate?: InputMaybe<Users_Aggregate_Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_roles_aggregate?: InputMaybe<User_Roles_Aggregate_Order_By>;
  username?: InputMaybe<Order_By>;
  usersManager_aggregate?: InputMaybe<Users_Aggregate_Order_By>;
  work_schedules_aggregate?: InputMaybe<Work_Schedule_Aggregate_Order_By>;
};

/** primary key columns input for table: users */
export type Users_Pk_Columns_Input = {
  /** Unique identifier for the user */
  id: Scalars["uuid"]["input"];
};

/** columns and relationships of "users_role_backup" */
export type Users_Role_Backup = {
  __typename: "users_role_backup";
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  email: Maybe<Scalars["String"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  role: Maybe<Scalars["user_role"]["output"]>;
};

/** aggregated selection of "users_role_backup" */
export type Users_Role_Backup_Aggregate = {
  __typename: "users_role_backup_aggregate";
  aggregate: Maybe<Users_Role_Backup_Aggregate_Fields>;
  nodes: Array<Users_Role_Backup>;
};

/** aggregate fields of "users_role_backup" */
export type Users_Role_Backup_Aggregate_Fields = {
  __typename: "users_role_backup_aggregate_fields";
  count: Scalars["Int"]["output"];
  max: Maybe<Users_Role_Backup_Max_Fields>;
  min: Maybe<Users_Role_Backup_Min_Fields>;
};

/** aggregate fields of "users_role_backup" */
export type Users_Role_Backup_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Users_Role_Backup_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** Boolean expression to filter rows from the table "users_role_backup". All fields are combined with a logical 'AND'. */
export type Users_Role_Backup_Bool_Exp = {
  _and?: InputMaybe<Array<Users_Role_Backup_Bool_Exp>>;
  _not?: InputMaybe<Users_Role_Backup_Bool_Exp>;
  _or?: InputMaybe<Array<Users_Role_Backup_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  email?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  role?: InputMaybe<User_Role_Comparison_Exp>;
};

/** input type for inserting data into table "users_role_backup" */
export type Users_Role_Backup_Insert_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  email?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  role?: InputMaybe<Scalars["user_role"]["input"]>;
};

/** aggregate max on columns */
export type Users_Role_Backup_Max_Fields = {
  __typename: "users_role_backup_max_fields";
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  email: Maybe<Scalars["String"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  role: Maybe<Scalars["user_role"]["output"]>;
};

/** aggregate min on columns */
export type Users_Role_Backup_Min_Fields = {
  __typename: "users_role_backup_min_fields";
  created_at: Maybe<Scalars["timestamptz"]["output"]>;
  email: Maybe<Scalars["String"]["output"]>;
  id: Maybe<Scalars["uuid"]["output"]>;
  role: Maybe<Scalars["user_role"]["output"]>;
};

/** response of any mutation on the table "users_role_backup" */
export type Users_Role_Backup_Mutation_Response = {
  __typename: "users_role_backup_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Users_Role_Backup>;
};

/** Ordering options when selecting data from "users_role_backup". */
export type Users_Role_Backup_Order_By = {
  created_at?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  role?: InputMaybe<Order_By>;
};

/** select columns of table "users_role_backup" */
export type Users_Role_Backup_Select_Column =
  /** column name */
  | "created_at"
  /** column name */
  | "email"
  /** column name */
  | "id"
  /** column name */
  | "role";

/** input type for updating data in table "users_role_backup" */
export type Users_Role_Backup_Set_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  email?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  role?: InputMaybe<Scalars["user_role"]["input"]>;
};

/** Streaming cursor of the table "users_role_backup" */
export type Users_Role_Backup_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Users_Role_Backup_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Users_Role_Backup_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  email?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  role?: InputMaybe<Scalars["user_role"]["input"]>;
};

export type Users_Role_Backup_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Users_Role_Backup_Set_Input>;
  /** filter the rows which have to be updated */
  where: Users_Role_Backup_Bool_Exp;
};

/** select columns of table "users" */
export type Users_Select_Column =
  /** column name */
  | "clerk_user_id"
  /** column name */
  | "created_at"
  /** column name */
  | "deactivated_at"
  /** column name */
  | "deactivated_by"
  /** column name */
  | "email"
  /** column name */
  | "id"
  /** column name */
  | "image"
  /** column name */
  | "is_active"
  /** column name */
  | "is_staff"
  /** column name */
  | "manager_id"
  /** column name */
  | "name"
  /** column name */
  | "role"
  /** column name */
  | "updated_at"
  /** column name */
  | "username";

/** select "users_aggregate_bool_exp_bool_and_arguments_columns" columns of table "users" */
export type Users_Select_Column_Users_Aggregate_Bool_Exp_Bool_And_Arguments_Columns =
  /** column name */
  | "is_active"
  /** column name */
  | "is_staff";

/** select "users_aggregate_bool_exp_bool_or_arguments_columns" columns of table "users" */
export type Users_Select_Column_Users_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns =
  /** column name */
  | "is_active"
  /** column name */
  | "is_staff";

/** input type for updating data in table "users" */
export type Users_Set_Input = {
  /** External identifier from Clerk authentication service */
  clerk_user_id?: InputMaybe<Scalars["String"]["input"]>;
  /** Timestamp when the user was created */
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  deactivated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  deactivated_by?: InputMaybe<Scalars["String"]["input"]>;
  /** User's email address (unique) */
  email?: InputMaybe<Scalars["String"]["input"]>;
  /** Unique identifier for the user */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** URL to the user's profile image */
  image?: InputMaybe<Scalars["String"]["input"]>;
  is_active?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Whether the user is a staff member (vs. external user) */
  is_staff?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Reference to the user's manager */
  manager_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** User's full name */
  name?: InputMaybe<Scalars["String"]["input"]>;
  /** User's system role (viewer, consultant, manager, org_admin) */
  role?: InputMaybe<Scalars["user_role"]["input"]>;
  /** Timestamp when the user was last updated */
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  /** User's unique username for login */
  username?: InputMaybe<Scalars["String"]["input"]>;
};

/** Streaming cursor of the table "users" */
export type Users_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Users_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Users_Stream_Cursor_Value_Input = {
  /** External identifier from Clerk authentication service */
  clerk_user_id?: InputMaybe<Scalars["String"]["input"]>;
  /** Timestamp when the user was created */
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  deactivated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  deactivated_by?: InputMaybe<Scalars["String"]["input"]>;
  /** User's email address (unique) */
  email?: InputMaybe<Scalars["String"]["input"]>;
  /** Unique identifier for the user */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** URL to the user's profile image */
  image?: InputMaybe<Scalars["String"]["input"]>;
  is_active?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Whether the user is a staff member (vs. external user) */
  is_staff?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Reference to the user's manager */
  manager_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** User's full name */
  name?: InputMaybe<Scalars["String"]["input"]>;
  /** User's system role (viewer, consultant, manager, org_admin) */
  role?: InputMaybe<Scalars["user_role"]["input"]>;
  /** Timestamp when the user was last updated */
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  /** User's unique username for login */
  username?: InputMaybe<Scalars["String"]["input"]>;
};

/** update columns of table "users" */
export type Users_Update_Column =
  /** column name */
  | "clerk_user_id"
  /** column name */
  | "created_at"
  /** column name */
  | "deactivated_at"
  /** column name */
  | "deactivated_by"
  /** column name */
  | "email"
  /** column name */
  | "id"
  /** column name */
  | "image"
  /** column name */
  | "is_active"
  /** column name */
  | "is_staff"
  /** column name */
  | "manager_id"
  /** column name */
  | "name"
  /** column name */
  | "role"
  /** column name */
  | "updated_at"
  /** column name */
  | "username";

export type Users_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Users_Set_Input>;
  /** filter the rows which have to be updated */
  where: Users_Bool_Exp;
};

/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export type Uuid_Comparison_Exp = {
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
export type Work_Schedule = {
  __typename: "work_schedule";
  /** Timestamp when the schedule entry was created */
  created_at: Maybe<Scalars["timestamp"]["output"]>;
  /** Unique identifier for the work schedule entry */
  id: Scalars["uuid"]["output"];
  /** Timestamp when the schedule entry was last updated */
  updated_at: Maybe<Scalars["timestamp"]["output"]>;
  /** An object relationship */
  user: Users;
  /** Reference to the user this schedule belongs to */
  user_id: Scalars["uuid"]["output"];
  /** Day of the week (Monday, Tuesday, etc.) */
  work_day: Scalars["String"]["output"];
  /** Number of hours worked on this day */
  work_hours: Scalars["numeric"]["output"];
  /** An object relationship */
  work_schedule_user: Users;
};

/** aggregated selection of "work_schedule" */
export type Work_Schedule_Aggregate = {
  __typename: "work_schedule_aggregate";
  aggregate: Maybe<Work_Schedule_Aggregate_Fields>;
  nodes: Array<Work_Schedule>;
};

export type Work_Schedule_Aggregate_Bool_Exp = {
  count?: InputMaybe<Work_Schedule_Aggregate_Bool_Exp_Count>;
};

export type Work_Schedule_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Work_Schedule_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Work_Schedule_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "work_schedule" */
export type Work_Schedule_Aggregate_Fields = {
  __typename: "work_schedule_aggregate_fields";
  avg: Maybe<Work_Schedule_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max: Maybe<Work_Schedule_Max_Fields>;
  min: Maybe<Work_Schedule_Min_Fields>;
  stddev: Maybe<Work_Schedule_Stddev_Fields>;
  stddev_pop: Maybe<Work_Schedule_Stddev_Pop_Fields>;
  stddev_samp: Maybe<Work_Schedule_Stddev_Samp_Fields>;
  sum: Maybe<Work_Schedule_Sum_Fields>;
  var_pop: Maybe<Work_Schedule_Var_Pop_Fields>;
  var_samp: Maybe<Work_Schedule_Var_Samp_Fields>;
  variance: Maybe<Work_Schedule_Variance_Fields>;
};

/** aggregate fields of "work_schedule" */
export type Work_Schedule_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Work_Schedule_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "work_schedule" */
export type Work_Schedule_Aggregate_Order_By = {
  avg?: InputMaybe<Work_Schedule_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Work_Schedule_Max_Order_By>;
  min?: InputMaybe<Work_Schedule_Min_Order_By>;
  stddev?: InputMaybe<Work_Schedule_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Work_Schedule_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Work_Schedule_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Work_Schedule_Sum_Order_By>;
  var_pop?: InputMaybe<Work_Schedule_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Work_Schedule_Var_Samp_Order_By>;
  variance?: InputMaybe<Work_Schedule_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "work_schedule" */
export type Work_Schedule_Arr_Rel_Insert_Input = {
  data: Array<Work_Schedule_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Work_Schedule_On_Conflict>;
};

/** aggregate avg on columns */
export type Work_Schedule_Avg_Fields = {
  __typename: "work_schedule_avg_fields";
  /** Number of hours worked on this day */
  work_hours: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "work_schedule" */
export type Work_Schedule_Avg_Order_By = {
  /** Number of hours worked on this day */
  work_hours?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "work_schedule". All fields are combined with a logical 'AND'. */
export type Work_Schedule_Bool_Exp = {
  _and?: InputMaybe<Array<Work_Schedule_Bool_Exp>>;
  _not?: InputMaybe<Work_Schedule_Bool_Exp>;
  _or?: InputMaybe<Array<Work_Schedule_Bool_Exp>>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
  work_day?: InputMaybe<String_Comparison_Exp>;
  work_hours?: InputMaybe<Numeric_Comparison_Exp>;
  work_schedule_user?: InputMaybe<Users_Bool_Exp>;
};

/** unique or primary key constraints on table "work_schedule" */
export type Work_Schedule_Constraint =
  /** unique or primary key constraint on columns "user_id", "work_day" */
  | "unique_user_work_day"
  /** unique or primary key constraint on columns "id" */
  | "work_schedule_pkey";

/** input type for incrementing numeric columns in table "work_schedule" */
export type Work_Schedule_Inc_Input = {
  /** Number of hours worked on this day */
  work_hours?: InputMaybe<Scalars["numeric"]["input"]>;
};

/** input type for inserting data into table "work_schedule" */
export type Work_Schedule_Insert_Input = {
  /** Timestamp when the schedule entry was created */
  created_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  /** Unique identifier for the work schedule entry */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Timestamp when the schedule entry was last updated */
  updated_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  /** Reference to the user this schedule belongs to */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Day of the week (Monday, Tuesday, etc.) */
  work_day?: InputMaybe<Scalars["String"]["input"]>;
  /** Number of hours worked on this day */
  work_hours?: InputMaybe<Scalars["numeric"]["input"]>;
  work_schedule_user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Work_Schedule_Max_Fields = {
  __typename: "work_schedule_max_fields";
  /** Timestamp when the schedule entry was created */
  created_at: Maybe<Scalars["timestamp"]["output"]>;
  /** Unique identifier for the work schedule entry */
  id: Maybe<Scalars["uuid"]["output"]>;
  /** Timestamp when the schedule entry was last updated */
  updated_at: Maybe<Scalars["timestamp"]["output"]>;
  /** Reference to the user this schedule belongs to */
  user_id: Maybe<Scalars["uuid"]["output"]>;
  /** Day of the week (Monday, Tuesday, etc.) */
  work_day: Maybe<Scalars["String"]["output"]>;
  /** Number of hours worked on this day */
  work_hours: Maybe<Scalars["numeric"]["output"]>;
};

/** order by max() on columns of table "work_schedule" */
export type Work_Schedule_Max_Order_By = {
  /** Timestamp when the schedule entry was created */
  created_at?: InputMaybe<Order_By>;
  /** Unique identifier for the work schedule entry */
  id?: InputMaybe<Order_By>;
  /** Timestamp when the schedule entry was last updated */
  updated_at?: InputMaybe<Order_By>;
  /** Reference to the user this schedule belongs to */
  user_id?: InputMaybe<Order_By>;
  /** Day of the week (Monday, Tuesday, etc.) */
  work_day?: InputMaybe<Order_By>;
  /** Number of hours worked on this day */
  work_hours?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Work_Schedule_Min_Fields = {
  __typename: "work_schedule_min_fields";
  /** Timestamp when the schedule entry was created */
  created_at: Maybe<Scalars["timestamp"]["output"]>;
  /** Unique identifier for the work schedule entry */
  id: Maybe<Scalars["uuid"]["output"]>;
  /** Timestamp when the schedule entry was last updated */
  updated_at: Maybe<Scalars["timestamp"]["output"]>;
  /** Reference to the user this schedule belongs to */
  user_id: Maybe<Scalars["uuid"]["output"]>;
  /** Day of the week (Monday, Tuesday, etc.) */
  work_day: Maybe<Scalars["String"]["output"]>;
  /** Number of hours worked on this day */
  work_hours: Maybe<Scalars["numeric"]["output"]>;
};

/** order by min() on columns of table "work_schedule" */
export type Work_Schedule_Min_Order_By = {
  /** Timestamp when the schedule entry was created */
  created_at?: InputMaybe<Order_By>;
  /** Unique identifier for the work schedule entry */
  id?: InputMaybe<Order_By>;
  /** Timestamp when the schedule entry was last updated */
  updated_at?: InputMaybe<Order_By>;
  /** Reference to the user this schedule belongs to */
  user_id?: InputMaybe<Order_By>;
  /** Day of the week (Monday, Tuesday, etc.) */
  work_day?: InputMaybe<Order_By>;
  /** Number of hours worked on this day */
  work_hours?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "work_schedule" */
export type Work_Schedule_Mutation_Response = {
  __typename: "work_schedule_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Work_Schedule>;
};

/** on_conflict condition type for table "work_schedule" */
export type Work_Schedule_On_Conflict = {
  constraint: Work_Schedule_Constraint;
  update_columns?: Array<Work_Schedule_Update_Column>;
  where?: InputMaybe<Work_Schedule_Bool_Exp>;
};

/** Ordering options when selecting data from "work_schedule". */
export type Work_Schedule_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
  work_day?: InputMaybe<Order_By>;
  work_hours?: InputMaybe<Order_By>;
  work_schedule_user?: InputMaybe<Users_Order_By>;
};

/** primary key columns input for table: work_schedule */
export type Work_Schedule_Pk_Columns_Input = {
  /** Unique identifier for the work schedule entry */
  id: Scalars["uuid"]["input"];
};

/** select columns of table "work_schedule" */
export type Work_Schedule_Select_Column =
  /** column name */
  | "created_at"
  /** column name */
  | "id"
  /** column name */
  | "updated_at"
  /** column name */
  | "user_id"
  /** column name */
  | "work_day"
  /** column name */
  | "work_hours";

/** input type for updating data in table "work_schedule" */
export type Work_Schedule_Set_Input = {
  /** Timestamp when the schedule entry was created */
  created_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  /** Unique identifier for the work schedule entry */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Timestamp when the schedule entry was last updated */
  updated_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  /** Reference to the user this schedule belongs to */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Day of the week (Monday, Tuesday, etc.) */
  work_day?: InputMaybe<Scalars["String"]["input"]>;
  /** Number of hours worked on this day */
  work_hours?: InputMaybe<Scalars["numeric"]["input"]>;
};

/** aggregate stddev on columns */
export type Work_Schedule_Stddev_Fields = {
  __typename: "work_schedule_stddev_fields";
  /** Number of hours worked on this day */
  work_hours: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "work_schedule" */
export type Work_Schedule_Stddev_Order_By = {
  /** Number of hours worked on this day */
  work_hours?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Work_Schedule_Stddev_Pop_Fields = {
  __typename: "work_schedule_stddev_pop_fields";
  /** Number of hours worked on this day */
  work_hours: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "work_schedule" */
export type Work_Schedule_Stddev_Pop_Order_By = {
  /** Number of hours worked on this day */
  work_hours?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Work_Schedule_Stddev_Samp_Fields = {
  __typename: "work_schedule_stddev_samp_fields";
  /** Number of hours worked on this day */
  work_hours: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "work_schedule" */
export type Work_Schedule_Stddev_Samp_Order_By = {
  /** Number of hours worked on this day */
  work_hours?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "work_schedule" */
export type Work_Schedule_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Work_Schedule_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Work_Schedule_Stream_Cursor_Value_Input = {
  /** Timestamp when the schedule entry was created */
  created_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  /** Unique identifier for the work schedule entry */
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Timestamp when the schedule entry was last updated */
  updated_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  /** Reference to the user this schedule belongs to */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Day of the week (Monday, Tuesday, etc.) */
  work_day?: InputMaybe<Scalars["String"]["input"]>;
  /** Number of hours worked on this day */
  work_hours?: InputMaybe<Scalars["numeric"]["input"]>;
};

/** aggregate sum on columns */
export type Work_Schedule_Sum_Fields = {
  __typename: "work_schedule_sum_fields";
  /** Number of hours worked on this day */
  work_hours: Maybe<Scalars["numeric"]["output"]>;
};

/** order by sum() on columns of table "work_schedule" */
export type Work_Schedule_Sum_Order_By = {
  /** Number of hours worked on this day */
  work_hours?: InputMaybe<Order_By>;
};

/** update columns of table "work_schedule" */
export type Work_Schedule_Update_Column =
  /** column name */
  | "created_at"
  /** column name */
  | "id"
  /** column name */
  | "updated_at"
  /** column name */
  | "user_id"
  /** column name */
  | "work_day"
  /** column name */
  | "work_hours";

export type Work_Schedule_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Work_Schedule_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Work_Schedule_Set_Input>;
  /** filter the rows which have to be updated */
  where: Work_Schedule_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Work_Schedule_Var_Pop_Fields = {
  __typename: "work_schedule_var_pop_fields";
  /** Number of hours worked on this day */
  work_hours: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "work_schedule" */
export type Work_Schedule_Var_Pop_Order_By = {
  /** Number of hours worked on this day */
  work_hours?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Work_Schedule_Var_Samp_Fields = {
  __typename: "work_schedule_var_samp_fields";
  /** Number of hours worked on this day */
  work_hours: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "work_schedule" */
export type Work_Schedule_Var_Samp_Order_By = {
  /** Number of hours worked on this day */
  work_hours?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Work_Schedule_Variance_Fields = {
  __typename: "work_schedule_variance_fields";
  /** Number of hours worked on this day */
  work_hours: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "work_schedule" */
export type Work_Schedule_Variance_Order_By = {
  /** Number of hours worked on this day */
  work_hours?: InputMaybe<Order_By>;
};
