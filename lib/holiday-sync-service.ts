// lib/holiday-sync-service.ts
import { gql } from '@apollo/client'
import { getAdminClient } from '@/lib/apollo-admin'

// Type definition for holiday API response
export interface PublicHoliday {
  date: string
  localName: string
  name: string
  countryCode: string
  fixed: boolean
  global: boolean
  counties?: string[]
  launchYear: number
  types: string[]
}

// GraphQL mutation to insert holidays
const INSERT_HOLIDAYS_MUTATION = gql`
  mutation InsertHolidays($objects: [holidays_insert_input!]!) {
    insert_holidays(
      objects: $objects, 
      on_conflict: {
        constraint: holidays_pkey,
        update_columns: [
          date, 
          local_name, 
          name, 
          is_fixed, 
          is_global, 
          launch_year, 
          types, 
          updated_at
        ]
      }
    ) {
      affected_rows
      returning {
        id
        date
        name
      }
    }
  }
`

export async function fetchPublicHolidays(year: number, countryCode: string): Promise<PublicHoliday[]> {
  try {
    const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch holidays: ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching public holidays:', error)
    throw error
  }
}

export async function syncHolidaysForCountry(year: number, countryCode: string, region?: string) {
  try {
    // Fetch holidays from API
    const publicHolidays = await fetchPublicHolidays(year, countryCode)

    // Transform holidays for Hasura insertion
    const holidaysToInsert = publicHolidays.map(holiday => ({
      date: holiday.date,
      local_name: holiday.localName,
      name: holiday.name,
      country_code: holiday.countryCode,
      region: region || null,
      is_fixed: holiday.fixed,
      is_global: holiday.global,
      launch_year: holiday.launchYear,
      types: holiday.types,
      // Ensure we have an updated_at timestamp
      updated_at: new Date().toISOString()
    }))

    // Use admin client to insert holidays
    const adminClient = getAdminClient()
    
    const { data, errors } = await adminClient.mutate({
      mutation: INSERT_HOLIDAYS_MUTATION,
      variables: { objects: holidaysToInsert }
    })

    if (errors) {
      console.error('GraphQL errors during holiday sync:', errors)
      throw new Error('Failed to sync holidays')
    }

    console.log(`Synced ${data.insert_holidays.affected_rows} holidays for ${countryCode} in ${year}`)
    return data.insert_holidays.returning
  } catch (error) {
    console.error(`Error syncing holidays for ${countryCode} in ${year}:`, error)
    throw error
  }
}

export async function syncAustralianHolidays() {
    const currentYear = new Date().getFullYear();
    const states = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"]; // All states
  
    try {
      await Promise.all(
        states.flatMap(state => [
          syncHolidaysForCountry(currentYear, "AU", state),
          syncHolidaysForCountry(currentYear + 1, "AU", state),
        ])
      );
  
      console.log("Successfully synced Australian holidays for all states");
      return true;
    } catch (error) {
      console.error("Failed to sync Australian holidays:", error);
      throw error;
    }
  }