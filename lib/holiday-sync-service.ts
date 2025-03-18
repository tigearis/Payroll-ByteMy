// lib/holiday-sync-service.ts
import { gql } from '@apollo/client'
import { adminApolloClient } from '@/lib/apollo-client'

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
        local_name,  # ✅ Corrected
        name, 
        country_code,  # ✅ Corrected
        region,
        is_fixed,  # ✅ Corrected
        is_global,  # ✅ Corrected
        launch_year,  # ✅ Corrected
        types, 
        updated_at  # ✅ Corrected
      ]
    }
  ) {
    affected_rows
    returning {
      id
      date
      local_name  # ✅ Corrected
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
        const publicHolidays = await fetchPublicHolidays(year, countryCode);

        // Separate national holidays (counties = null) from state-specific ones

        const holidaysToInsert = publicHolidays.map(holiday => ({
            date: holiday.date,
            local_name: holiday.localName,
            name: holiday.name,
            country_code: holiday.countryCode,
            region: holiday.counties ? holiday.counties.map(c => c.replace("${holiday.courtyCode}-", "")) : ["National"], // ✅ Store as an array
            is_fixed: holiday.fixed,
            is_global: holiday.global,
            launch_year: holiday.launchYear,
            types: holiday.types,
            updated_at: new Date().toISOString()
        }));


        // Use admin client to insert holidays
        const adminClient = adminApolloClient;

        // Insert national holidays first (only once)
        if (!region) {  // ✅ Insert National Holidays only once (when region is undefined)
            const { data, errors } = await adminClient.mutate({
                mutation: INSERT_HOLIDAYS_MUTATION,
                variables: { objects: holidaysToInsert }
            });

            if (errors) {
                console.error('GraphQL errors during national holiday sync:', errors);
                throw new Error('Failed to sync national holidays');
            }
            console.log(`Synced ${data.insert_holidays.affected_rows} national holidays for ${countryCode} in ${year}`);
        }

        return true;
    } catch (error) {
        console.error(`Error syncing holidays for ${countryCode} in ${year}:`, error);
        throw error;
    }
}



export async function syncAustralianHolidays() {
    const currentYear = new Date().getFullYear();

    try {
        // ✅ Insert all holidays at once per year (API handles state breakdown)
        await Promise.all([
            syncHolidaysForCountry(currentYear, "AU"),
            syncHolidaysForCountry(currentYear + 1, "AU"),
        ]);

        console.log("Successfully synced Australian holidays");
        return true;
    } catch (error) {
        console.error("Failed to sync Australian holidays:", error);
        throw error;
    }
}
