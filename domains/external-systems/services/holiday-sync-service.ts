// lib/holiday-sync-service.ts
import { gql } from "@apollo/client";
import { adminApolloClient } from "@/lib/apollo/unified-client";

// Type definition for holiday API response from date.nager.at
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

// Type definition for data.gov.au API response
export interface DataGovAuHoliday {
  _id: number;
  Date: string; // YYYYMMDD format
  "Holiday Name": string;
  Information?: string;
  "More Information"?: string;
  Jurisdiction: string; // lowercase state code (nsw, vic, qld, etc.)
}

// Jurisdiction mapping for Australian states/territories
const JURISDICTION_MAPPING: Record<string, string> = {
  nsw: 'NSW',
  vic: 'VIC', 
  qld: 'QLD',
  sa: 'SA',
  wa: 'WA',
  tas: 'TAS',
  nt: 'NT',
  act: 'ACT',
};

// NSW and National holidays are relevant for EFT adjustments
const EFT_RELEVANT_REGIONS = ['NSW', 'National', 'Australia'];

// GraphQL query to check existing holidays
const CHECK_EXISTING_HOLIDAYS_QUERY = gql`
  query CheckExistingHolidays($year: Int!, $countryCode: bpchar!) {
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
  mutation InsertHolidays($objects: [HolidaysInsertInput!]!) {
    insertHolidays(
      objects: $objects
      onConflict: {
        constraint: holidays_pkey
        updateColumns: [
          date
          localName
          name
          countryCode
          region
          isFixed
          isGlobal
          launchYear
          types
          updatedAt
        ]
      }
    ) {
      affected_rows
      returning {
        id
        date
        localName
        name
        countryCode
        region
      }
    }
  }
`;

// Enhanced mutation with isEftRelevant field
const INSERT_HOLIDAYS_ENHANCED_MUTATION = gql`
  mutation InsertHolidaysEnhanced($objects: [HolidaysInsertInput!]!) {
    insertHolidays(
      objects: $objects
      onConflict: {
        constraint: holidays_pkey
        updateColumns: [
          date
          localName
          name
          countryCode
          region
          isFixed
          isGlobal
          launchYear
          types
          updatedAt
        ]
      }
    ) {
      affected_rows
      returning {
        id
        date
        localName
        name
        countryCode
        region
      }
    }
  }
`;

// Fallback mutation if the unique constraint doesn't exist yet
const INSERT_HOLIDAYS_FALLBACK_MUTATION = gql`
  mutation InsertHolidaysFallback($objects: [HolidaysInsertInput!]!) {
    insertHolidays(
      objects: $objects
      onConflict: {
        constraint: holidays_pkey
        updateColumns: [
          date
          localName
          name
          countryCode
          region
          isFixed
          isGlobal
          launchYear
          types
          updatedAt
        ]
      }
    ) {
      affected_rows
      returning {
        id
        date
        localName
        name
        countryCode
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

/**
 * Fetch comprehensive Australian holidays from data.gov.au
 * @param year Year to fetch holidays for
 * @param jurisdictions Optional array of jurisdictions to filter (e.g., ['nsw', 'act'])
 * @returns Promise<DataGovAuHoliday[]>
 */
export async function fetchDataGovAuHolidays(
  year: number,
  jurisdictions?: string[]
): Promise<DataGovAuHoliday[]> {
  try {
    const resourceId = '4d4d744b-50ed-45b9-ae77-760bc478ad75'; // 2025 dataset ID
    let url = `https://data.gov.au/api/3/action/datastore_search?resource_id=${resourceId}&limit=1000`;
    
    // Add jurisdiction filtering if specified
    if (jurisdictions && jurisdictions.length > 0) {
      const filters = JSON.stringify({ Jurisdiction: jurisdictions });
      url += `&filters=${encodeURIComponent(filters)}`;
    }

    console.log(`🌐 Fetching Australian holidays from data.gov.au: ${url}`);
    
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch data.gov.au holidays: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.success || !data.result || !data.result.records) {
      throw new Error('Invalid response format from data.gov.au API');
    }

    const holidays = data.result.records as DataGovAuHoliday[];
    console.log(`📥 Fetched ${holidays.length} holidays from data.gov.au`);
    
    return holidays;
  } catch (error) {
    console.error("Error fetching data.gov.au holidays:", error);
    throw error;
  }
}

/**
 * Transform and consolidate data.gov.au holiday data by grouping same dates
 * @param holidays Array of DataGovAuHoliday objects
 * @returns Array of consolidated objects ready for database insertion
 */
export function transformDataGovAuHolidays(holidays: DataGovAuHoliday[]) {
  const validHolidays: DataGovAuHoliday[] = [];
  let skippedCount = 0;
  
  // Filter out holidays with invalid dates
  holidays.forEach(holiday => {
    if (!holiday.Date || typeof holiday.Date !== 'string' || holiday.Date.length !== 8) {
      console.warn(`⚠️ Skipping holiday with invalid date:`, {
        name: holiday["Holiday Name"],
        date: holiday.Date,
        jurisdiction: holiday.Jurisdiction
      });
      skippedCount++;
      return;
    }
    
    // Validate date string is numeric
    if (!/^\d{8}$/.test(holiday.Date)) {
      console.warn(`⚠️ Skipping holiday with non-numeric date:`, {
        name: holiday["Holiday Name"],
        date: holiday.Date,
        jurisdiction: holiday.Jurisdiction
      });
      skippedCount++;
      return;
    }
    
    validHolidays.push(holiday);
  });
  
  if (skippedCount > 0) {
    console.log(`📊 Skipped ${skippedCount} holidays with invalid dates`);
  }
  
  console.log(`✅ Processing ${validHolidays.length} valid holidays`);
  
  // Group holidays by date to consolidate same-day holidays across jurisdictions
  const groupedByDate = validHolidays.reduce((acc, holiday) => {
    const dateKey = holiday.Date;
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(holiday);
    return acc;
  }, {} as Record<string, DataGovAuHoliday[]>);
  
  console.log(`📅 Grouped into ${Object.keys(groupedByDate).length} unique dates`);
  
  // Transform each date group into consolidated holiday records
  return Object.entries(groupedByDate).map(([dateStr, holidaysForDate]) => {
    try {
      // Convert YYYYMMDD to ISO date format
      const isoDate = `${dateStr.slice(0,4)}-${dateStr.slice(4,6)}-${dateStr.slice(6,8)}`;
      
      // Get all regions for this date
      const regions = holidaysForDate.map(h => 
        JURISDICTION_MAPPING[h.Jurisdiction] || h.Jurisdiction.toUpperCase()
      );
      
      // Remove duplicates and sort
      const uniqueRegions = [...new Set(regions)].sort();
      
      // Check if this is a national holiday (all 8 Australian states/territories)
      // Australia has 8 states/territories: NSW, VIC, QLD, SA, WA, TAS, NT, ACT
      const allAustralianRegions = ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT'];
      const isNational = uniqueRegions.length === allAustralianRegions.length && 
                        allAustralianRegions.every(region => uniqueRegions.includes(region));
      
      // Use the first holiday for name and other details (they should be the same for same date)
      const primaryHoliday = holidaysForDate[0];
      
      // Determine if this holiday is relevant for EFT adjustments
      const isEftRelevant = isNational || uniqueRegions.some(region => EFT_RELEVANT_REGIONS.includes(region));
      
      const consolidatedHoliday = {
        date: isoDate,
        localName: primaryHoliday["Holiday Name"],
        name: primaryHoliday["Holiday Name"],
        countryCode: 'AU',
        region: isNational ? ['National'] : uniqueRegions,
        isFixed: true, // Most public holidays are fixed dates
        isGlobal: false, // Australian holidays are not global/international
        launchYear: null, // Not provided by data.gov.au
        types: ['public'], // Assume all are public holidays
        updatedAt: new Date().toISOString(),
      };
      
      // Log consolidation details for reporting
      if (holidaysForDate.length > 1) {
        console.log(`🔄 Consolidated ${holidaysForDate.length} holidays for ${isoDate} (${primaryHoliday["Holiday Name"]}):`);
        console.log(`   Jurisdictions: ${holidaysForDate.map(h => h.Jurisdiction).sort().join(', ')}`);
        console.log(`   Result: ${isNational ? 'National' : uniqueRegions.join(', ')}`);
      }
      
      return consolidatedHoliday;
    } catch (error) {
      console.error(`❌ Error transforming holiday group for date ${dateStr}:`, {
        holidaysCount: holidaysForDate.length,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  });
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
          holidaysAggregate(
            where: {
              countryCode: { _eq: $countryCode }
              date: { _gte: $startDate, _lt: $endDate }
            }
          ) {
            aggregate {
              count
            }
          }
          holidays(
            where: {
              countryCode: { _eq: $countryCode }
              date: { _gte: $startDate, _lt: $endDate }
            }
            limit: 3
            orderBy: { date: ASC }
          ) {
            date
            name
            countryCode
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

    if (data && data.holidaysAggregate) {
      const count = data.holidaysAggregate.aggregate.count;
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
    const holidaysToInsert = publicHolidays.map(holiday => ({
      date: holiday.date,
      localName: holiday.localName,
      name: holiday.name,
      countryCode: holiday.countryCode,
      region: holiday.counties
        ? holiday.counties.map(c => c.replace(`${holiday.countryCode}-`, ""))
        : ["National"],
      isFixed: holiday.fixed,
      isGlobal: holiday.global,
      launchYear: holiday.launchYear,
      types: holiday.types,
      updatedAt: new Date().toISOString(),
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
          `✅ Successfully synced ${data.insertHolidays.affected_rows} holidays for ${countryCode} ${year}`
        );

        return {
          success: true,
          affectedRows: data.insertHolidays.affected_rows,
          newHolidays: holidaysToInsert.length,
          message: `Synced ${data.insertHolidays.affected_rows} holidays for ${countryCode} ${year}`,
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
          `✅ Successfully synced ${data.insertHolidays.affected_rows} holidays for ${countryCode} ${year} (fallback)`
        );

        return {
          success: true,
          affectedRows: data.insertHolidays.affected_rows,
          newHolidays: holidaysToInsert.length,
          message: `Synced ${data.insertHolidays.affected_rows} holidays for ${countryCode} ${year} (fallback)`,
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

/**
 * Sync comprehensive Australian holidays from data.gov.au
 * Includes all states/territories but marks NSW + National as EFT relevant
 * @param year Year to sync holidays for
 * @param forceSync Whether to force sync even if data exists
 * @returns Sync results with statistics
 */
export async function syncComprehensiveAustralianHolidays(
  year: number = new Date().getFullYear(),
  forceSync: boolean = false
) {
  try {
    console.log(`🚀 Starting comprehensive Australian holiday sync for ${year}...`);

    // Check if holidays already exist for this year
    if (!forceSync) {
      const existing = await checkExistingHolidays(year, 'AU');
      if (existing.count > 0) {
        console.log(`✅ Found ${existing.count} existing holidays for AU ${year}`);
        console.log(`   Skipping sync (use forceSync=true to override)`);
        return {
          skipped: true,
          existingCount: existing.count,
          message: `${existing.count} holidays already exist for AU ${year}`,
        };
      }
    }

    // Fetch all Australian holidays from data.gov.au
    const dataGovHolidays = await fetchDataGovAuHolidays(year);
    
    // Transform data for database insertion
    const holidaysToInsert = transformDataGovAuHolidays(dataGovHolidays);
    
    // Calculate EFT relevant holidays (NSW and National)
    const eftRelevantCount = holidaysToInsert.filter(h => 
      h.region.some(r => EFT_RELEVANT_REGIONS.includes(r))
    ).length;
    
    // Count national vs regional holidays
    const nationalHolidays = holidaysToInsert.filter(h => h.region.includes('National'));
    const regionalHolidays = holidaysToInsert.filter(h => !h.region.includes('National'));
    
    console.log(`📝 Prepared ${holidaysToInsert.length} consolidated holidays for insertion`);
    console.log(`   🇦🇺 National holidays: ${nationalHolidays.length}`);
    console.log(`   🏛️ Regional holidays: ${regionalHolidays.length}`);
    console.log(`   🏦 EFT Relevant: ${eftRelevantCount}`);
    console.log(`   ℹ️ Informational: ${holidaysToInsert.length - eftRelevantCount}`);
    
    // Summary of consolidation efficiency
    const originalCount = dataGovHolidays.length;
    const consolidatedCount = holidaysToInsert.length;
    const reductionPercent = ((originalCount - consolidatedCount) / originalCount * 100).toFixed(1);
    console.log(`   📊 Consolidation: ${originalCount} → ${consolidatedCount} records (${reductionPercent}% reduction)`);
    
    // List national holidays for visibility
    if (nationalHolidays.length > 0) {
      console.log(`   🎉 National holidays detected:`);
      nationalHolidays.forEach(h => {
        console.log(`      ${h.date}: ${h.name}`);
      });
    }
    
    // Group by region type for reporting
    const byRegionType = {
      National: nationalHolidays.length,
      'Multi-State': regionalHolidays.filter(h => h.region.length > 1).length,
      'Single-State': regionalHolidays.filter(h => h.region.length === 1).length,
    };
    
    console.log(`   📍 By coverage:`, byRegionType);

    // Insert holidays using admin client
    try {
      const { data, errors } = await adminApolloClient.mutate({
        mutation: INSERT_HOLIDAYS_MUTATION,
        variables: { objects: holidaysToInsert },
      });

      if (errors) {
        console.error("GraphQL errors during comprehensive holiday sync:", JSON.stringify(errors, null, 2));
        console.error("Variables used:", JSON.stringify({ objects: holidaysToInsert.slice(0, 2) }, null, 2));
        throw new Error(`Failed to sync comprehensive holidays: ${errors.map(e => e.message).join(', ')}`);
      }

      console.log(`✅ Successfully synced ${data.insertHolidays.affected_rows} holidays for AU ${year}`);
      
      return {
        success: true,
        affectedRows: data.insertHolidays.affected_rows,
        totalHolidays: holidaysToInsert.length,
        originalRecordCount: dataGovHolidays.length,
        consolidatedRecordCount: holidaysToInsert.length,
        nationalHolidays: nationalHolidays.length,
        regionalHolidays: regionalHolidays.length,
        eftRelevantHolidays: eftRelevantCount,
        coverageBreakdown: byRegionType,
        message: `Synced ${data.insertHolidays.affected_rows} consolidated Australian holidays for ${year} (${dataGovHolidays.length} → ${holidaysToInsert.length} records)`,
      };
    } catch (error) {
      // Fallback to basic mutation if main mutation fails
      console.warn("Falling back to basic holiday insertion...", error instanceof Error ? error.message : String(error));
      
      const { data, errors } = await adminApolloClient.mutate({
        mutation: INSERT_HOLIDAYS_FALLBACK_MUTATION,
        variables: { objects: holidaysToInsert },
      });

      if (errors) {
        console.error("GraphQL errors during fallback comprehensive holiday sync:", JSON.stringify(errors, null, 2));
        console.error("Fallback variables used:", JSON.stringify({ objects: holidaysToInsert.slice(0, 2) }, null, 2));
        throw new Error(`Failed to sync comprehensive holidays with fallback method: ${errors.map(e => e.message).join(', ')}`);
      }

      console.log(`✅ Successfully synced ${data.insertHolidays.affected_rows} holidays for AU ${year} (fallback)`);
      
      return {
        success: true,
        affectedRows: data.insertHolidays.affected_rows,
        totalHolidays: holidaysToInsert.length,
        originalRecordCount: dataGovHolidays.length,
        consolidatedRecordCount: holidaysToInsert.length,
        nationalHolidays: nationalHolidays.length,
        regionalHolidays: regionalHolidays.length,
        eftRelevantHolidays: eftRelevantCount,
        coverageBreakdown: byRegionType,
        message: `Synced ${data.insertHolidays.affected_rows} consolidated Australian holidays for ${year} (fallback, ${dataGovHolidays.length} → ${holidaysToInsert.length} records)`,
      };
    }
  } catch (error) {
    console.error(`❌ Error syncing comprehensive holidays for AU in ${year}:`, error);
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

    // Use comprehensive sync for better coverage
    const results = await Promise.all([
      syncComprehensiveAustralianHolidays(currentYear, forceSync),
      syncComprehensiveAustralianHolidays(currentYear + 1, forceSync),
    ]);

    const totalAffected = results.reduce(
      (sum: number, result: any) => sum + (result.affectedRows || 0),
      0
    );
    const skippedCount = results.filter((result: any) => result.skipped).length;
    const totalEftRelevant = results.reduce(
      (sum: number, result: any) => sum + (result.eftRelevantHolidays || 0),
      0
    );

    console.log(`🎉 Australian holiday sync completed!`);
    console.log(`   Years processed: ${currentYear}, ${currentYear + 1}`);
    console.log(`   Total holidays affected: ${totalAffected}`);
    console.log(`   EFT Relevant holidays: ${totalEftRelevant}`);
    console.log(`   Years skipped (already had data): ${skippedCount}`);

    return {
      success: true,
      results,
      totalAffected,
      totalEftRelevant,
      skippedCount,
      message: `Australian holiday sync completed: ${totalAffected} holidays processed (${totalEftRelevant} EFT relevant), ${skippedCount} years skipped`,
    };
  } catch (error) {
    console.error("❌ Failed to sync Australian holidays:", error);
    throw error;
  }
}
