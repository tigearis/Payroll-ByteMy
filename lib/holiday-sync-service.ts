// lib/holiday-sync-service.ts
import { gql } from "@apollo/client";
import { adminApolloClient } from "@/lib/server-apollo-client";

// Type definition for holiday API response
export interface PublicHoliday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  fixed: boolean;
  global: boolean;
  counties?: string[];
  launchYear: number;
  types: string[];
}

// GraphQL query to check existing holidays
const CHECK_EXISTING_HOLIDAYS_QUERY = gql`
  query CheckExistingHolidays($year: Int!, $countryCode: String!) {
    holidays_aggregate(
      where: {
        country_code: { _eq: $countryCode }
        date: { _gte: $year, _lt: $year }
      }
    ) {
      aggregate {
        count
      }
    }
    holidays(
      where: {
        country_code: { _eq: $countryCode }
        date: { _gte: $year, _lt: $year }
      }
      limit: 5
    ) {
      date
      name
      country_code
    }
  }
`;

// GraphQL mutation to insert holidays with better conflict resolution
const INSERT_HOLIDAYS_MUTATION = gql`
  mutation InsertHolidays($objects: [holidays_insert_input!]!) {
    insert_holidays(
      objects: $objects
      on_conflict: {
        constraint: holidays_date_country_code_key
        update_columns: [
          local_name
          name
          region
          is_fixed
          is_global
          launch_year
          types
          updated_at
        ]
      }
    ) {
      affected_rows
      returning {
        id
        date
        local_name
        name
        country_code
      }
    }
  }
`;

// Fallback mutation if the unique constraint doesn't exist yet
const INSERT_HOLIDAYS_FALLBACK_MUTATION = gql`
  mutation InsertHolidaysFallback($objects: [holidays_insert_input!]!) {
    insert_holidays(
      objects: $objects
      on_conflict: {
        constraint: holidays_pkey
        update_columns: [
          date
          local_name
          name
          country_code
          region
          is_fixed
          is_global
          launch_year
          types
          updated_at
        ]
      }
    ) {
      affected_rows
      returning {
        id
        date
        local_name
        name
        country_code
      }
    }
  }
`;

export async function fetchPublicHolidays(
  year: number,
  countryCode: string
): Promise<PublicHoliday[]> {
  try {
    const response = await fetch(
      `https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch holidays: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching public holidays:", error);
    throw error;
  }
}

export async function checkExistingHolidays(
  year: number,
  countryCode: string
): Promise<{ count: number; sampleHolidays: any[] }> {
  try {
    const startDate = `${year}-01-01`;
    const endDate = `${year + 1}-01-01`;

    console.log(
      `🔍 Checking existing holidays for ${countryCode} ${year} (${startDate} to ${endDate})`
    );

    const { data, errors } = await adminApolloClient.query({
      query: gql`
        query CheckExistingHolidays(
          $startDate: date!
          $endDate: date!
          $countryCode: bpchar!
        ) {
          holidays_aggregate(
            where: {
              country_code: { _eq: $countryCode }
              date: { _gte: $startDate, _lt: $endDate }
            }
          ) {
            aggregate {
              count
            }
          }
          holidays(
            where: {
              country_code: { _eq: $countryCode }
              date: { _gte: $startDate, _lt: $endDate }
            }
            limit: 3
            order_by: { date: asc }
          ) {
            date
            name
            country_code
          }
        }
      `,
      variables: {
        startDate,
        endDate,
        countryCode,
      },
      fetchPolicy: "network-only", // Always fetch fresh data
      errorPolicy: "all", // Include both data and errors
    });

    if (errors && errors.length > 0) {
      console.warn("GraphQL errors while checking existing holidays:", errors);
      console.warn("But continuing with partial data if available...");
    }

    if (data && data.holidays_aggregate) {
      const count = data.holidays_aggregate.aggregate.count;
      const samples = data.holidays || [];

      console.log(
        `📊 Found ${count} existing holidays for ${countryCode} ${year}`
      );
      if (samples.length > 0) {
        console.log(
          `   Sample: ${samples
            .map((h: any) => `${h.date}: ${h.name}`)
            .join(", ")}`
        );
      }

      return {
        count: count || 0,
        sampleHolidays: samples,
      };
    } else {
      console.warn("No data received from holidays query");
      return { count: 0, sampleHolidays: [] };
    }
  } catch (error) {
    console.error("Failed to check existing holidays:", error);
    // Re-throw the error so we can see what's happening
    console.error("Full error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return { count: 0, sampleHolidays: [] };
  }
}

export async function syncHolidaysForCountry(
  year: number,
  countryCode: string,
  region?: string,
  forceSync: boolean = false
) {
  try {
    console.log(`🔄 Starting holiday sync for ${countryCode} ${year}...`);

    // Check if holidays already exist for this year/country
    if (!forceSync) {
      const existing = await checkExistingHolidays(year, countryCode);

      if (existing.count > 0) {
        console.log(
          `✅ Found ${existing.count} existing holidays for ${countryCode} ${year}`
        );
        console.log(
          `   Sample holidays:`,
          existing.sampleHolidays.map((h: any) => `${h.date}: ${h.name}`)
        );
        console.log(`   Skipping sync (use forceSync=true to override)`);

        return {
          skipped: true,
          existingCount: existing.count,
          message: `${existing.count} holidays already exist for ${countryCode} ${year}`,
        };
      }
    }

    // Fetch holidays from API
    const publicHolidays = await fetchPublicHolidays(year, countryCode);
    console.log(
      `📥 Fetched ${publicHolidays.length} holidays from external API`
    );

    // Transform data for database insertion
    const holidaysToInsert = publicHolidays.map((holiday) => ({
      date: holiday.date,
      local_name: holiday.localName,
      name: holiday.name,
      country_code: holiday.countryCode,
      region: holiday.counties
        ? holiday.counties.map((c) => c.replace(`${holiday.countryCode}-`, ""))
        : ["National"],
      is_fixed: holiday.fixed,
      is_global: holiday.global,
      launch_year: holiday.launchYear,
      types: holiday.types,
      updated_at: new Date().toISOString(),
    }));

    console.log(
      `📝 Prepared ${holidaysToInsert.length} holidays for insertion`
    );

    // Use admin client to insert holidays
    const adminClient = adminApolloClient;

    if (!region) {
      try {
        // Try with the proper unique constraint first
        const { data, errors } = await adminClient.mutate({
          mutation: INSERT_HOLIDAYS_MUTATION,
          variables: { objects: holidaysToInsert },
        });

        if (errors) {
          console.error("GraphQL errors during holiday sync:", errors);
          throw new Error("Failed to sync holidays");
        }

        console.log(
          `✅ Successfully synced ${data.insert_holidays.affected_rows} holidays for ${countryCode} ${year}`
        );

        return {
          success: true,
          affectedRows: data.insert_holidays.affected_rows,
          newHolidays: holidaysToInsert.length,
          message: `Synced ${data.insert_holidays.affected_rows} holidays for ${countryCode} ${year}`,
        };
      } catch (error) {
        // If unique constraint doesn't exist, fall back to primary key constraint
        console.warn(
          "Falling back to primary key constraint...",
          error instanceof Error ? error.message : String(error)
        );

        const { data, errors } = await adminClient.mutate({
          mutation: INSERT_HOLIDAYS_FALLBACK_MUTATION,
          variables: { objects: holidaysToInsert },
        });

        if (errors) {
          console.error("GraphQL errors during fallback holiday sync:", errors);
          throw new Error("Failed to sync holidays with fallback method");
        }

        console.log(
          `✅ Successfully synced ${data.insert_holidays.affected_rows} holidays for ${countryCode} ${year} (fallback)`
        );

        return {
          success: true,
          affectedRows: data.insert_holidays.affected_rows,
          newHolidays: holidaysToInsert.length,
          message: `Synced ${data.insert_holidays.affected_rows} holidays for ${countryCode} ${year} (fallback)`,
        };
      }
    }

    return {
      success: true,
      message: "Region-specific sync not implemented yet",
    };
  } catch (error) {
    console.error(
      `❌ Error syncing holidays for ${countryCode} in ${year}:`,
      error
    );
    throw error;
  }
}

export async function syncAustralianHolidays(forceSync: boolean = false) {
  const currentYear = new Date().getFullYear();

  try {
    console.log(
      `🚀 Starting Australian holiday sync for ${currentYear}-${
        currentYear + 1
      }...`
    );

    const results = await Promise.all([
      syncHolidaysForCountry(currentYear, "AU", undefined, forceSync),
      syncHolidaysForCountry(currentYear + 1, "AU", undefined, forceSync),
    ]);

    const totalAffected = results.reduce(
      (sum: number, result: any) => sum + (result.affectedRows || 0),
      0
    );
    const skippedCount = results.filter((result: any) => result.skipped).length;

    console.log(`🎉 Australian holiday sync completed!`);
    console.log(`   Years processed: ${currentYear}, ${currentYear + 1}`);
    console.log(`   Total holidays affected: ${totalAffected}`);
    console.log(`   Years skipped (already had data): ${skippedCount}`);

    return {
      success: true,
      results,
      totalAffected,
      skippedCount,
      message: `Australian holiday sync completed: ${totalAffected} holidays processed, ${skippedCount} years skipped`,
    };
  } catch (error) {
    console.error("❌ Failed to sync Australian holidays:", error);
    throw error;
  }
}
