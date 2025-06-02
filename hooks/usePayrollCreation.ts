import { useMutation } from "@apollo/client";
import { gql } from "@apollo/client";
import { toast } from "sonner";

// GraphQL mutation for creating payroll
const CREATE_PAYROLL_MUTATION = gql`
  mutation CreatePayroll($input: payrolls_insert_input!) {
    insert_payrolls_one(object: $input) {
      id
      name
      client_id
      cycle_id
      date_type_id
      date_value
      start_date
      active
      created_at
    }
  }
`;

// GraphQL query for generating 2 years of dates
const GENERATE_TWO_YEARS_DATES_QUERY = gql`
  query GeneratePayrollDatesTwoYears($payrollId: uuid!, $startDate: date!) {
    generate_payroll_dates_two_years(
      p_payroll_id: $payrollId
      p_start_date: $startDate
    ) {
      id
      original_eft_date
      adjusted_eft_date
      processing_date
      notes
    }
  }
`;

interface CreatePayrollInput {
  name: string;
  client_id: string;
  cycle_id: string;
  date_type_id: string;
  date_value: number;
  start_date: string;
  primary_consultant_user_id?: string;
  backup_consultant_user_id?: string;
  manager_user_id?: string;
  active?: boolean;
}

export function usePayrollCreation() {
  const [createPayroll, { loading: creating }] = useMutation(
    CREATE_PAYROLL_MUTATION
  );

  const [generateDates, { loading: generatingDates }] = useMutation(
    GENERATE_TWO_YEARS_DATES_QUERY
  );

  const createPayrollWithDates = async (input: CreatePayrollInput) => {
    try {
      console.log("🚀 Creating payroll with automatic date generation...");

      // Step 1: Create the payroll
      const payrollResult = await createPayroll({
        variables: {
          input: {
            ...input,
            active: input.active ?? true,
          },
        },
      });

      const newPayroll = payrollResult.data?.insert_payrolls_one;
      if (!newPayroll) {
        throw new Error("Failed to create payroll");
      }

      console.log(
        `✅ Payroll created: ${newPayroll.name} (ID: ${newPayroll.id})`
      );
      toast.success(`Payroll "${newPayroll.name}" created successfully`);

      // Step 2: Generate 2 years of dates automatically
      console.log("📅 Generating 2 years of payroll dates...");
      toast.info("Generating payroll dates for the next 2 years...");

      try {
        const datesResult = await generateDates({
          variables: {
            payrollId: newPayroll.id,
            startDate: input.start_date,
          },
        });

        const generatedDates =
          datesResult.data?.generate_payroll_dates_two_years;
        const dateCount = generatedDates?.length || 0;

        console.log(`✅ Generated ${dateCount} payroll dates`);
        toast.success(
          `Generated ${dateCount} payroll dates for the next 2 years`
        );

        return {
          payroll: newPayroll,
          generatedDates,
          dateCount,
          success: true,
        };
      } catch (dateError: any) {
        console.error("❌ Failed to generate dates:", dateError);
        toast.error(
          `Payroll created but failed to generate dates: ${dateError.message}`
        );

        // Still return success since payroll was created
        return {
          payroll: newPayroll,
          generatedDates: [],
          dateCount: 0,
          success: true,
          dateGenerationError: dateError.message,
        };
      }
    } catch (error: any) {
      console.error("❌ Failed to create payroll:", error);
      toast.error(`Failed to create payroll: ${error.message}`);

      return {
        payroll: null,
        generatedDates: [],
        dateCount: 0,
        success: false,
        error: error.message,
      };
    }
  };

  return {
    createPayrollWithDates,
    loading: creating || generatingDates,
    creating,
    generatingDates,
  };
}

// Helper function for manual date generation (used in edit scenarios)
export function usePayrollDateGeneration() {
  const [generateDates, { loading }] = useMutation(
    GENERATE_TWO_YEARS_DATES_QUERY
  );

  const generateTwoYearsOfDates = async (
    payrollId: string,
    startDate: string
  ) => {
    try {
      console.log(`📅 Generating 2 years of dates for payroll ${payrollId}...`);
      toast.info("Generating payroll dates...");

      const result = await generateDates({
        variables: {
          payrollId,
          startDate,
        },
      });

      const generatedDates = result.data?.generate_payroll_dates_two_years;
      const dateCount = generatedDates?.length || 0;

      console.log(`✅ Generated ${dateCount} payroll dates`);
      toast.success(`Generated ${dateCount} payroll dates`);

      return {
        generatedDates,
        dateCount,
        success: true,
      };
    } catch (error: any) {
      console.error("❌ Failed to generate dates:", error);
      toast.error(`Failed to generate dates: ${error.message}`);

      return {
        generatedDates: [],
        dateCount: 0,
        success: false,
        error: error.message,
      };
    }
  };

  return {
    generateTwoYearsOfDates,
    loading,
  };
}
