import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { graphql } from "../graphql/generated/gql";
import { useFragment } from "../graphql/generated/fragment-masking";
import {
  GetPayrollsQuery,
  GetPayrollByIdQuery,
  CreatePayrollMutation,
  UpdatePayrollMutation,
} from "../graphql/generated/graphql";

// Define the GraphQL documents
const GetPayrollsDocument = graphql(`
  query GetPayrolls {
    payrolls(
      where: { superseded_date: { _is_null: true } }
      order_by: { updated_at: desc }
    ) {
      ...PayrollWithDates
    }
  }
`);

const GetPayrollByIdDocument = graphql(`
  query GetPayrollById($id: uuid!) {
    payrolls_by_pk(id: $id) {
      ...PayrollWithDates
    }
  }
`);

const GetPayrollsByClientDocument = graphql(`
  query GetPayrollsByClient($clientId: uuid!) {
    payrolls(
      where: {
        client_id: { _eq: $clientId }
        superseded_date: { _is_null: true }
      }
      order_by: { updated_at: desc }
    ) {
      ...PayrollWithDates
    }
  }
`);

const GetPayrollsByMonthDocument = graphql(`
  query GetPayrollsByMonth($startDate: date!, $endDate: date!) {
    payrolls(
      where: {
        superseded_date: { _is_null: true }
        payroll_dates: {
          adjusted_eft_date: { _gte: $startDate, _lte: $endDate }
        }
      }
      order_by: { updated_at: desc }
    ) {
      ...PayrollWithDates
    }
  }
`);

const CreatePayrollDocument = graphql(`
  mutation CreatePayroll(
    $name: String!
    $clientId: uuid!
    $cycleId: uuid!
    $dateTypeId: uuid!
    $dateValue: Int
    $primaryConsultantId: uuid!
    $backupConsultantId: uuid
    $managerId: uuid!
    $processingDaysBeforeEft: Int!
    $payrollSystem: String
    $employeeCount: Int
  ) {
    insert_payrolls_one(
      object: {
        name: $name
        client_id: $clientId
        cycle_id: $cycleId
        date_type_id: $dateTypeId
        date_value: $dateValue
        primary_consultant_user_id: $primaryConsultantId
        backup_consultant_user_id: $backupConsultantId
        manager_user_id: $managerId
        processing_days_before_eft: $processingDaysBeforeEft
        payroll_system: $payrollSystem
        employee_count: $employeeCount
        status: "Implementation"
        version_number: 1
      }
    ) {
      ...PayrollWithRelations
    }
  }
`);

const UpdatePayrollDocument = graphql(`
  mutation UpdatePayroll(
    $id: uuid!
    $name: String
    $cycleId: uuid
    $dateTypeId: uuid
    $dateValue: Int
    $primaryConsultantId: uuid
    $backupConsultantId: uuid
    $managerId: uuid
    $processingDaysBeforeEft: Int
    $payrollSystem: String
    $employeeCount: Int
    $status: payroll_status
  ) {
    update_payrolls_by_pk(
      pk_columns: { id: $id }
      _set: {
        name: $name
        cycle_id: $cycleId
        date_type_id: $dateTypeId
        date_value: $dateValue
        primary_consultant_user_id: $primaryConsultantId
        backup_consultant_user_id: $backupConsultantId
        manager_user_id: $managerId
        processing_days_before_eft: $processingDaysBeforeEft
        payroll_system: $payrollSystem
        employee_count: $employeeCount
        status: $status
        updated_at: "now()"
      }
    ) {
      ...PayrollWithRelations
    }
  }
`);

const UpdatePayrollStatusDocument = graphql(`
  mutation UpdatePayrollStatus($id: uuid!, $status: payroll_status!) {
    update_payrolls_by_pk(
      pk_columns: { id: $id }
      _set: { status: $status, updated_at: "now()" }
    ) {
      id
      status
      updated_at
    }
  }
`);

const DeletePayrollDocument = graphql(`
  mutation DeletePayroll($id: uuid!) {
    delete_payrolls_by_pk(id: $id) {
      id
    }
  }
`);

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

    // Use fragment to access the data
    const payrollData = useFragment(PayrollWithDatesFragment, payroll);

    return {
      isSuperseded: !!payrollData?.superseded_date,
      versionNumber: payrollData?.version_number,
      supersededDate: payrollData?.superseded_date,
    };
  }
}
