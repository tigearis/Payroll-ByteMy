import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import {
  GetPayrollsDocument,
  GetPayrollByIdDocument,
  CreatePayrollDocument,
  UpdatePayrollDocument,
  GetPayrollsByClientDocument,
  GetPayrollsByMonthDocument,
  UpdatePayrollStatusDocument,
  DeletePayrollDocument,
  CheckPayrollVersionDocument,
  GetPayrollsQuery,
  GetPayrollByIdQuery,
  CreatePayrollMutation,
  UpdatePayrollMutation,
  CheckPayrollVersionQuery,
} from "../graphql/generated/graphql";
import { useFragment } from "../graphql/generated/fragment-masking";

// Export individual operations for backward compatibility
export const CREATE_PAYROLL = CreatePayrollDocument;
export const GET_PAYROLLS = GetPayrollsDocument;
export const GET_PAYROLL_BY_ID = GetPayrollByIdDocument;

export class PayrollService {
  constructor(private apolloClient: ApolloClient<NormalizedCacheObject>) {}

  /**
   * Get all active payrolls (not superseded)
   */
  async getPayrolls() {
    const { data } = await this.apolloClient.query<GetPayrollsQuery>({
      query: GetPayrollsDocument,
      fetchPolicy: "network-only",
    });
    return data.payrolls;
  }

  /**
   * Get a single payroll by ID
   */
  async getPayrollById(id: string) {
    const { data } = await this.apolloClient.query<GetPayrollByIdQuery>({
      query: GetPayrollByIdDocument,
      variables: { id },
    });
    return data.payroll;
  }

  /**
   * Get payrolls for a specific client
   */
  async getPayrollsByClient(clientId: string) {
    const { data } = await this.apolloClient.query({
      query: GetPayrollsByClientDocument,
      variables: { clientId },
    });
    return data.payrolls;
  }

  /**
   * Get payrolls for a specific month
   */
  async getPayrollsByMonth(startDate: string, endDate: string) {
    const { data } = await this.apolloClient.query({
      query: GetPayrollsByMonthDocument,
      variables: { startDate, endDate },
    });
    return data.payrolls;
  }

  /**
   * Create a new payroll
   */
  async createPayroll(input: {
    name: string;
    clientId: string;
    cycleId: string;
    dateTypeId: string;
    dateValue?: number | null;
    primaryConsultantId: string;
    backupConsultantId?: string | null;
    managerId: string;
    processingDaysBeforeEft: number;
    payrollSystem?: string | null;
    employeeCount?: number | null;
  }) {
    const { data } = await this.apolloClient.mutate<CreatePayrollMutation>({
      mutation: CreatePayrollDocument,
      variables: input,
    });
    return data?.insertPayroll;
  }

  /**
   * Update an existing payroll
   */
  async updatePayroll(
    id: string,
    input: {
      name?: string | null;
      cycleId?: string | null;
      dateTypeId?: string | null;
      dateValue?: number | null;
      primaryConsultantId?: string | null;
      backupConsultantId?: string | null;
      managerId?: string | null;
      processingDaysBeforeEft?: number | null;
      payrollSystem?: string | null;
      employeeCount?: number | null;
      status?: any | null; // payroll_status enum
    }
  ) {
    const { data } = await this.apolloClient.mutate<UpdatePayrollMutation>({
      mutation: UpdatePayrollDocument,
      variables: { id, ...input },
    });
    return data?.updatePayroll;
  }

  /**
   * Update payroll status
   */
  async updatePayrollStatus(id: string, status: any) {
    const { data } = await this.apolloClient.mutate({
      mutation: UpdatePayrollStatusDocument,
      variables: { id, status },
    });
    return data?.updatePayroll;
  }

  /**
   * Delete a payroll
   */
  async deletePayroll(id: string) {
    const { data } = await this.apolloClient.mutate({
      mutation: DeletePayrollDocument,
      variables: { id },
    });
    return data?.deletePayroll;
  }

  /**
   * Check if a payroll has been superseded
   */
  async checkPayrollVersion(id: string) {
    const { data } = await this.apolloClient.query<CheckPayrollVersionQuery>({
      query: CheckPayrollVersionDocument,
      variables: { id },
    });

    const payroll = data.payroll;
    if (!payroll) return null;

    return {
      isSuperseded: !!payroll.supersededDate,
      versionNumber: payroll.versionNumber,
      supersededDate: payroll.supersededDate,
    };
  }
}
