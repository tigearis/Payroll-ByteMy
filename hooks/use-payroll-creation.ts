import { useMutation, useLazyQuery } from "@apollo/client";
import { toast } from "sonner";

// Import GraphQL operations from domains
import { 
  CreatePayrollDocument,
  GeneratePayrollDatesQueryDocument 
} from "@/domains/payrolls/graphql/generated/graphql";

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
    CreatePayrollDocument
  );

  const [generateDates, { loading: generatingDates }] = useLazyQuery(
    GeneratePayrollDatesQueryDocument
  );

  const createPayrollWithDates = async (input: CreatePayrollInput) => {
    try {
      console.log("🚀 Creating payroll with automatic date generation...");

      // Step 1: Create the payroll
      const payrollResult = await createPayroll({
        variables: {
          object: {
            name: input.name,
            clientId: input.client_id,
            cycleId: input.cycle_id,
            primaryConsultantUserId: input.primary_consultant_user_id || null,
            managerUserId: input.manager_user_id || null,
            // Note: processing_days_before_eft field may need schema update
          },
        },
      });

      const newPayroll = payrollResult.data?.insertPayroll;
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
            endDate: null, // Will use default 2 years
            maxDates: 104 // ~2 years for weekly payrolls
          },
        });

        const generatedDates = datesResult.data?.generatePayrollDates;
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
  const [generateDates, { loading }] = useLazyQuery(
    GeneratePayrollDatesQueryDocument
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
          payrollId: payrollId,
          startDate: startDate,
          endDate: null, // Will use default 2 years
          maxDates: 104 // ~2 years for weekly payrolls
        },
      });

      const generatedDates = result.data?.generatePayrollDates;
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
