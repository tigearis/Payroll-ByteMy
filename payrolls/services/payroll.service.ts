import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { useFragment } from "../graphql/generated/fragment-masking";
import {
  GetPayrollsQuery,
  GetPayrollByIdQuery,
  CreatePayrollMutation,
  UpdatePayrollMutation,
  GetPayrollsDocument,
  GetPayrollByIdDocument,
  GetPayrollsByClientDocument,
  GetPayrollsByMonthDocument,
  CreatePayrollDocument,
  UpdatePayrollDocument,
  UpdatePayrollStatusDocument,
  DeletePayrollDocument,
} from "../graphql/generated/graphql";

// GraphQL documents are now imported directly from generated files

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
    return data.payrolls_by_pk;
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
    return data?.insert_payrolls_one;
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
    return data?.update_payrolls_by_pk;
  }

  /**
   * Update payroll status
   */
  async updatePayrollStatus(id: string, status: any) {
    const { data } = await this.apolloClient.mutate({
      mutation: UpdatePayrollStatusDocument,
      variables: { id, status },
    });
    return data?.update_payrolls_by_pk;
  }

  /**
   * Delete a payroll
   */
  async deletePayroll(id: string) {
    const { data } = await this.apolloClient.mutate({
      mutation: DeletePayrollDocument,
      variables: { id },
    });
    return data?.delete_payrolls_by_pk;
  }

  /**
   * Check if a payroll has been superseded
   */
  async checkPayrollVersion(id: string) {
    const payroll = await this.getPayrollById(id);
    if (!payroll) return null;

    // Access the payroll data with type assertion to handle fragment types
    const payrollData = payroll as any;

    return {
      isSuperseded: !!payrollData?.superseded_date,
      versionNumber: payrollData?.version_number,
      supersededDate: payrollData?.superseded_date,
    };
  }
}
