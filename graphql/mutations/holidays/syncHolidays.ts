import { gql } from "@apollo/client";

export const SYNC_HOLIDAYS = gql`  
mutation SyncHolidays($objects: [holidays_insert_input!]!) {
    insert_holidays(
      objects: $objects,
      on_conflict: {
        constraint: holidays_date_country_code_key,
        update_columns: [local_name, name, is_global, updated_at]
      }
    ) {
      affected_rows
    }
  }`
  ;
  