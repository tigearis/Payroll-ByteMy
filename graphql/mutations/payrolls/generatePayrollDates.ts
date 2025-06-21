// Re-export GraphQL operations from domain files
export { 
  GeneratePayrollDatesDocument as GENERATE_PAYROLL_DATES,
  GetPayrollsMissingDatesDocument as GET_PAYROLLS_MISSING_DATES 
} from "@/domains/payrolls/graphql/generated";
