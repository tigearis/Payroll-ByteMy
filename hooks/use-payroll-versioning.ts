import { useMutation, useQuery } from "@apollo/client";
import { toast } from "sonner";
import { AddPayrollNoteDocument } from "@/domains/notes/graphql/generated/graphql";
import {
  UpdatePayrollDocument,
  CreatePayrollDocument,
  UpdatePayrollStatusDocument,
  GetPayrollVersionsDocument,
  GetLatestPayrollVersionDocument,
} from "@/domains/payrolls/graphql/generated/graphql";
import { useCurrentUser } from "@/hooks/use-current-user";

/**
 * Payroll Versioning Hook - Complete Field Requirements
 *
 * When creating a new payroll version, ALL fields must be properly handled:
 *
 * REQUIRED FIELDS (will cause errors if missing):
 * - clientId: Must exist (inherited from current payroll)
 * - cycleId: Must exist (inherited from current payroll)
 * - processingDaysBeforeEft: Defaults to 4 if null
 * - createdByUserId: Must be provided (current user ID)
 * - employeeCount: Defaults to 0 if null
 * - goLiveDate: Must be provided
 *
 * DATE REGENERATION LOGIC:
 * - If goLiveDate is in the past or today:
 *   * Supersede old payroll from TODAY
 *   * Delete old payroll dates from TODAY forward
 *   * Generate new payroll dates from TODAY forward
 *
 * - If goLiveDate is in the future:
 *   * Supersede old payroll from goLiveDate
 *   * Delete old payroll dates from goLiveDate forward
 *   * Generate new payroll dates from goLiveDate forward
 *
 * USAGE EXAMPLE:
 * ```typescript
 * const { savePayrollEdit, createVersioningInput, currentUserId } = usePayrollVersioning();
 *
 * const handleSaveVersion = async () => {
 *   const input = createVersioningInput(
 *     currentPayroll,
 *     {
 *       name: "Updated Payroll Name",
 *       employeeCount: 25,
 *       processingDaysBeforeEft: 3
 *     },
 *     "2024-02-15", // goLiveDate
 *     "schedule_change" // versionReason
 *   );
 *
 *   const result = await savePayrollEdit(input);
 *   if (result.success) {
 *     console.log(
 *       `Version ${result.versionNumber} created with ${result.employeeCount} employees`
 *     );
 *   }
 * };
 * ```
 */
interface SavePayrollEditInput {
  currentPayroll: any;
  editedFields: {
    name?: string;
    clientId?: string;
    cycleId?: string;
    dateTypeId?: string;
    dateValue?: number;
    primaryConsultantUserId?: string;
    backupConsultantUserId?: string;
    managerUserId?: string;
    processingDaysBeforeEft?: number;
    employeeCount?: number;
    status?: string;
  };
  goLiveDate: string;
  versionReason: string;
  createdByUserId: string; // Now required - must be valid UUID
}

export function usePayrollVersioning() {
  const [supersedeCurrentPayroll] = useMutation(UpdatePayrollDocument);
  const [insertNewPayrollVersion] = useMutation(CreatePayrollDocument);
  const [updateStatus] = useMutation(UpdatePayrollStatusDocument);
  const [createProcessingNotes] = useMutation(AddPayrollNoteDocument);
  const { currentUserId } = useCurrentUser();

  // Helper function to create a complete versioning input with current user
  const createVersioningInput = (
    currentPayroll: any,
    editedFields: any,
    goLiveDate: string,
    versionReason: string
  ): SavePayrollEditInput => {
    if (!currentUserId) {
      throw new Error("User must be authenticated to create payroll versions");
    }

    return {
      currentPayroll,
      editedFields,
      goLiveDate,
      versionReason,
      createdByUserId: currentUserId,
    };
  };

  const savePayrollEdit = async (input: SavePayrollEditInput) => {
    try {
      console.log(
        "🔄 Starting payroll edit with versioning (using database triggers)..."
      );
      console.log("📋 Current payroll:", input.currentPayroll);
      console.log("📋 Edited fields:", input.editedFields);
      console.log("📅 Go-live date:", input.goLiveDate);

      const {
        currentPayroll,
        editedFields,
        goLiveDate,
        versionReason,
        createdByUserId,
      } = input;

      // Validate required fields before proceeding
      if (!currentPayroll.client_id) {
        throw new Error(
          "Payroll must have a client assigned before creating a version"
        );
      }
      if (!currentPayroll.cycleId) {
        throw new Error(
          "Payroll must have a cycle assigned before creating a version"
        );
      }
      if (!createdByUserId) {
        throw new Error(
          "Created by user ID is required for payroll versioning"
        );
      }

      // Ensure processing_days_before_eft has a valid value (matches database NOT NULL constraint)
      const processingDaysBeforeEft =
        editedFields.processingDaysBeforeEft !== undefined
          ? editedFields.processingDaysBeforeEft
          : currentPayroll.processing_days_before_eft || 4; // Default to 4 if null

      if (
        processingDaysBeforeEft === null ||
        processingDaysBeforeEft === undefined
      ) {
        throw new Error("Processing days before EFT must be specified");
      }

      // Ensure employee_count has a valid value
      const employeeCount =
        editedFields.employeeCount !== undefined
          ? editedFields.employeeCount
          : currentPayroll.employee_count || 0; // Default to 0 if null

      // Determine date regeneration logic based on go_live_date
      const goLiveDateObj = new Date(goLiveDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time for accurate comparison
      goLiveDateObj.setHours(0, 0, 0, 0);

      const isGoLiveDateInPast = goLiveDateObj < today;
      const isGoLiveDateToday = goLiveDateObj.getTime() === today.getTime();
      const isGoLiveDateInFuture = goLiveDateObj > today;

      console.log(`📅 Go-live date analysis:`);
      console.log(`   Go-live date: ${goLiveDate}`);
      console.log(`   Today: ${today.toISOString().split("T")[0]}`);
      console.log(`   Is in past: ${isGoLiveDateInPast}`);
      console.log(`   Is today: ${isGoLiveDateToday}`);
      console.log(`   Is in future: ${isGoLiveDateInFuture}`);

      // Step 1: Supersede the current version
      console.log("🔄 Step 1: Superseding current payroll version...");

      if (isGoLiveDateInPast || isGoLiveDateToday) {
        console.log(
          "   📅 Go-live date is today or in past - using today as supersede date"
        );
        console.log("   🗑️ Will delete old payroll dates from today forward");
        await supersedeCurrentPayroll({
          variables: {
            id: currentPayroll.id,
            set: { supersededDate: today.toISOString().split("T")[0] }, // Use today's date
          },
        });
      } else {
        console.log(
          "   📅 Go-live date is in future - using go-live date as supersede date"
        );
        console.log(
          `   🗑️ Will delete old payroll dates from ${goLiveDate} forward`
        );
        await supersedeCurrentPayroll({
          variables: {
            id: currentPayroll.id,
            set: { supersededDate: goLiveDate },
          },
        });
      }

      console.log(
        "✅ Current payroll version superseded (future dates auto-deleted by trigger)"
      );

      // Step 2: Insert new version with edited data
      console.log("🔄 Step 2: Inserting new payroll version...");
      console.log(
        "   🤖 Database trigger will auto-generate dates from go-live date"
      );

      // Merge current data with edits, ensuring all required fields have values
      const newVersionData = {
        parent_payroll_id:
          currentPayroll.parent_payroll_id || currentPayroll.id,
        version_number: (currentPayroll.version_number || 1) + 1,
        go_live_date: goLiveDate,
        name: editedFields.name || currentPayroll.name,
        clientId: editedFields.clientId || currentPayroll.clientId, // This is now guaranteed to exist
        cycleId: editedFields.cycleId || currentPayroll.cycleId, // This is now guaranteed to exist
        dateTypeId:
          editedFields.dateTypeId || currentPayroll.dateTypeId || null,
        dateValue:
          editedFields.dateValue !== undefined
            ? editedFields.dateValue
            : currentPayroll.dateValue || null,
        primaryConsultantUserId:
          editedFields.primaryConsultantUserId !== undefined
            ? editedFields.primaryConsultantUserId
            : currentPayroll.primaryConsultantUserId || null,
        backupConsultantUserId:
          editedFields.backupConsultantUserId !== undefined
            ? editedFields.backupConsultantUserId
            : currentPayroll.backupConsultantUserId || null,
        managerUserId:
          editedFields.managerUserId !== undefined
            ? editedFields.managerUserId
            : currentPayroll.managerUserId || null,
        processingDaysBeforeEft: processingDaysBeforeEft,
        status:
          editedFields.status || currentPayroll.status || "Implementation", // Use provided status or fallback
        version_reason: versionReason,
        created_by_user_id: createdByUserId, // Now required
        employeeCount: employeeCount, // Now properly handled with default 0
      };

      console.log("📋 New version data:", newVersionData);

      const insertResult = await insertNewPayrollVersion({
        variables: {
          object: newVersionData,
        },
      });

      const newPayrollData = insertResult.data?.insertPayroll;
      if (!newPayrollData) {
        throw new Error("Failed to insert new payroll version");
      }

      // Cast to any to access properties that might not be in the fragment
      const payrollInfo = newPayrollData as any;

      console.log(`✅ New payroll version created: ${payrollInfo}`);
      console.log(
        "✅ Database triggers handled date deletion and generation automatically"
      );

      // Create processing notes for the version
      try {
        await createProcessingNotes({
          variables: {
            payrollId: payrollInfo.id,
            content: `Version ${newVersionData.version_number} created for "${versionReason}"`,
            userId: createdByUserId,
            isImportant: true,
          },
        });
        console.log("✅ Processing notes created successfully");
      } catch (noteError) {
        console.warn("⚠️ Failed to create processing notes:", noteError);
        // Don't fail the entire operation if notes creation fails
      }

      // Success messages with more specific information
      const dateRegenerationMessage =
        isGoLiveDateInPast || isGoLiveDateToday
          ? "Dates regenerated from today (go-live date was in past)"
          : `Dates will be generated from ${goLiveDate}`;

      toast.success(`Created payroll version (go-live: ${goLiveDate})`);

      toast.info(dateRegenerationMessage);

      toast.success(
        `Payroll version ready with employee count: ${employeeCount}`
      );

      return {
        success: true,
        newVersionId: payrollInfo.id || "unknown",
        versionNumber: newVersionData.version_number,
        oldPayrollId: currentPayroll.id,
        employeeCount: employeeCount,
        dateRegenerationInfo: {
          goLiveDateInPast: isGoLiveDateInPast,
          regenerationStartDate:
            isGoLiveDateInPast || isGoLiveDateToday
              ? today.toISOString().split("T")[0]
              : goLiveDate,
        },
        message: `Version ${newVersionData.version_number} created with ${employeeCount} employees`,
      };
    } catch (error: any) {
      console.error("❌ Failed to save payroll edit:", error);
      toast.error(`Failed to save payroll edit: ${error.message}`);

      return {
        success: false,
        error: error.message,
      };
    }
  };

  // Simple status update without versioning (for direct status changes)
  const updateStatusOnly = async (payrollId: string, newStatus: string) => {
    try {
      console.log(`🔄 Updating payroll ${payrollId} status to ${newStatus}...`);

      const result = await updateStatus({
        variables: {
          id: payrollId,
          status: newStatus,
        },
      });

      if (result.data?.updatePayrollById) {
        console.log(`✅ Status updated successfully to ${newStatus}`);
        toast.success(`Status changed to ${newStatus}`);
        return {
          success: true,
          newStatus: newStatus, // The mutation doesn't return status in this generated version
        };
      } else {
        throw new Error("No data returned from status update");
      }
    } catch (error: any) {
      console.error("❌ Failed to update status:", error);
      toast.error(`Failed to update status: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  };

  // Helper function to create processing notes
  const addProcessingNote = async (
    payrollId: string,
    content: string,
    isImportant = false
  ) => {
    if (!currentUserId) {
      return { success: false, error: "User ID is required" };
    }

    try {
      const result = await createProcessingNotes({
        variables: {
          payrollId,
          content,
          userId: currentUserId,
          isImportant,
        },
      });
      console.log("✅ Processing note added successfully");
      return { success: true, note: result.data?.insertNote };
    } catch (error: any) {
      console.error("❌ Failed to add processing note:", error);
      return { success: false, error: error.message };
    }
  };

  return {
    savePayrollEdit,
    createVersioningInput,
    updateStatusOnly,
    addProcessingNote,
    currentUserId,
    loading: false, // Individual mutations handle their own loading states
  };
}

// Hook for querying payroll version history
export function usePayrollVersionHistory(payrollId: string) {
  const { data, loading, error, refetch } = useQuery(
    GetPayrollVersionsDocument,
    {
      variables: { payrollId },
      skip: !payrollId,
    }
  );

  return {
    versionHistory: data?.payrolls || [],
    loading,
    error,
    refetch,
  };
}

// Hook for getting latest version of a payroll
export function useLatestPayrollVersion(payrollId: string) {
  const { data, loading, error } = useQuery(GetLatestPayrollVersionDocument, {
    variables: { payrollId },
    skip: !payrollId,
  });

  return {
    latestVersion: data?.payrolls?.[0],
    loading,
    error,
  };
}

// Helper function to detect if changes require versioning
export function requiresVersioning(
  originalPayroll: any,
  changes: any
): boolean {
  const versioningFields = ["cycleId", "dateTypeId", "dateValue", "clientId"];

  return versioningFields.some(field => {
    const originalValue = originalPayroll[field];
    const newValue = changes[field];
    return newValue !== undefined && newValue !== originalValue;
  });
}

// Helper function to get version reason based on changes
export function getVersionReason(changes: any): string {
  if (changes.cycleId || changes.dateTypeId || changes.dateValue) {
    return "schedule_change";
  }
  if (changes.clientId) {
    return "client_change";
  }
  if (
    changes.primaryConsultantUserId ||
    changes.backupConsultantUserId ||
    changes.managerUserId
  ) {
    return "consultant_change";
  }
  return "correction";
}

// Simple hook for just status updates (no versioning)
export function usePayrollStatusUpdate() {
  const [updateStatus] = useMutation(UpdatePayrollStatusDocument);

  const updatePayrollStatus = async (payrollId: string, newStatus: string) => {
    try {
      console.log(`🔄 Updating payroll ${payrollId} status to ${newStatus}...`);

      const result = await updateStatus({
        variables: {
          id: payrollId,
          status: newStatus,
        },
        // Refetch queries to update the UI
        refetchQueries: [
          {
            query: GetLatestPayrollVersionDocument,
            variables: { payrollId: payrollId },
          },
        ],
        awaitRefetchQueries: true,
      });

      if (result.data?.updatePayrollById) {
        console.log(`✅ Status updated successfully to ${newStatus}`);
        toast.success(`Status changed to ${newStatus}`);
        return {
          success: true,
          newStatus: newStatus, // The mutation doesn't return status in this generated version
          updatedAt: new Date().toISOString(), // Use current timestamp
        };
      } else {
        throw new Error("No data returned from status update");
      }
    } catch (error: any) {
      console.error("❌ Failed to update status:", error);
      toast.error(`Failed to update status: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  };

  return {
    updatePayrollStatus,
  };
}
