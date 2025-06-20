// graphql/mutations/payrolls/createPayroll.ts
import { gql } from "@apollo/client";

export const CREATE_PAYROLL = gql` 
mutation CreatePayroll($clientId: uuid!, $name: String!, $cycleId: uuid!, $dateTypeId: uuid!, $dateValue: Int, $primaryConsultantId: uuid, $backupConsultantId: uuid, $managerId: uuid, $processingDaysBeforeEft: Int!) {
    insert_payrolls_one(
      object: {
        client_id: $clientId,
        name: $name,
        cycle_id: $cycleId,
        date_type_id: $dateTypeId,
        date_value: $dateValue,
        primary_consultant_user_id: $primaryConsultantId,
        backup_consultant_user_id: $backupConsultantId,
        manager_user_id: $managerId,
        processing_days_before_eft: $processingDaysBeforeEft,
        status: "Implementation"
      }
    ) {
      id
      name
    }
  }`
  ;
  

  