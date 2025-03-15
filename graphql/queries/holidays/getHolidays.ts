// graphql/queries/holidays/getHolidays.ts
import { gql } from "@apollo/client"

export const GET_HOLIDAYS = gql`
query GetHolidays {
  holidays {
    country_code
    date
    local_name
    types
    region
  }
}`
;