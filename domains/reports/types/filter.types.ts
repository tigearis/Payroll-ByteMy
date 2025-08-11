import { z } from "zod";

export const FilterOperatorSchema = z.enum([
  "equals",
  "notEquals",
  "contains",
  "notContains",
  "greaterThan",
  "lessThan",
  "between",
  "in",
  "notIn",
  "isNull",
  "isNotNull",
  "startsWith",
  "endsWith",
]);

export const FilterConjunctionSchema = z.enum(["AND", "OR"]);

export const FilterConditionSchema = z.object({
  field: z.string(),
  operator: FilterOperatorSchema,
  value: z.any().optional(),
  valueEnd: z.any().optional(), // For "between" operator
});

export const FilterGroupSchema = z.object({
  conjunction: FilterConjunctionSchema,
  conditions: z.array(
    z.union([z.lazy(() => FilterGroupSchema), FilterConditionSchema])
  ),
});

export const AggregationFunctionSchema = z.enum([
  "sum",
  "avg",
  "min",
  "max",
  "count",
  "countDistinct",
]);

export const AggregationSchema = z.object({
  name: z.string(),
  function: AggregationFunctionSchema,
  field: z.string(),
  filter: FilterGroupSchema.optional(),
});

export const GroupBySchema = z.object({
  field: z.string(),
  timeUnit: z.enum(["year", "quarter", "month", "week", "day"]).optional(), // For date fields
});

export const CalculatedFieldSchema = z.object({
  name: z.string(),
  expression: z.string(), // SQL-like expression
  referencedFields: z.array(z.string()),
});

// Export types
export type FilterOperator = z.infer<typeof FilterOperatorSchema>;
export type FilterConjunction = z.infer<typeof FilterConjunctionSchema>;
export type FilterCondition = z.infer<typeof FilterConditionSchema>;
export type FilterGroup = z.infer<typeof FilterGroupSchema>;
export type AggregationFunction = z.infer<typeof AggregationFunctionSchema>;
export type Aggregation = z.infer<typeof AggregationSchema>;
export type GroupBy = z.infer<typeof GroupBySchema>;
export type CalculatedField = z.infer<typeof CalculatedFieldSchema>;

// Helper functions
export const createFilterCondition = (
  field: string,
  operator: FilterOperator,
  value?: any,
  valueEnd?: any
): FilterCondition => ({
  field,
  operator,
  value,
  valueEnd,
});

export const createFilterGroup = (
  conjunction: FilterConjunction,
  conditions: (FilterCondition | FilterGroup)[] = []
): FilterGroup => ({
  conjunction,
  conditions,
});

export const createAggregation = (
  name: string,
  func: AggregationFunction,
  field: string,
  filter?: FilterGroup
): Aggregation => ({
  name,
  function: func,
  field,
  filter,
});
