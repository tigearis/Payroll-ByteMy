import { gql } from "@apollo/client"

export const GET_PAYROLLS= gql`
query GetPayrolls($id: uuid!) {
    payrolls{
        id
        name
        client_id
        cycle_id
        date_type_id
        date_value
        primary_consultant_id
        backup_consultant_id
        manager_id
        processing_days_before_eft
        payroll_system
        status
        created_at
        updated_at
        payroll_dates {
            adjusted_eft_date
            original_eft_date
            processing_date
        }
    }
}
`