// graphql/mutations/payrolls/updatePayroll.ts
import { gql } from "@apollo/client";

export const UPDATE_PAYROLL = gql` 
mutation UpdatePayroll($id: uuid!, $name: String, $cycleId: uuid, $dateTypeId: uuid, $dateValue: Int, $primaryConsultantId: uuid, $backupConsultantId: uuid, $managerId: uuid, $processingDaysBeforeEft: Int, $status: payroll_status) {
    update_payrolls_by_pk(
      pk_columns: { id: $id },
      _set: {
        name: $name,
        cycle_id: $cycleId,
        date_type_id: $dateTypeId,
        date_value: $dateValue,
        primary_consultant_user_id: $primaryConsultantId,
        backup_consultant_user_id: $backupConsultantId,
        manager_user_id: $managerId,
        processing_days_before_eft: $processingDaysBeforeEft,
        status: $status,
        updated_at: "now()"
      }
    ) {
      id
      name
      updated_at
    }
  }`
  ;