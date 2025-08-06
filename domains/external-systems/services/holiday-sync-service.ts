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

// Data.gov.au resource IDs for different years
const DATA_GOV_AU_RESOURCE_IDS: Record<number, string> = {
  2024: '9e920340-0744-4031-a497-98ab796633e8',
  2025: '4d4d744b-50ed-45b9-ae77-760bc478ad75',
  // 2026: 'TBD - not available yet from data.gov.au'
};

// Combined dataset that may contain multiple years
const DATA_GOV_AU_COMBINED_RESOURCE_ID = '33673aca-0857-42e5-b8f0-9981b4755686';

// Expected Australian public holidays that should exist each year (for fallback generation)
const STANDARD_AUSTRALIAN_HOLIDAYS = [
  { name: "New Year's Day", date: "01-01", regions: ["National"] },
  { name: "Australia Day", date: "01-26", regions: ["National"] },
  { name: "Good Friday", date: "easter-2", regions: ["National"] }, // 2 days before Easter
  { name: "Easter Saturday", date: "easter-1", regions: ["National"] }, // 1 day before Easter
  { name: "Easter Monday", date: "easter+1", regions: ["National"] }, // 1 day after Easter
  { name: "Anzac Day", date: "04-25", regions: ["National"] },
  { name: "Christmas Day", date: "12-25", regions: ["National"] },
  { name: "Boxing Day", date: "12-26", regions: ["National"] },
];

// NSW and National holidays are relevant for EFT adjustments
const EFT_RELEVANT_REGIONS = ['NSW', 'National', 'Australia'];

/**
 * Calculate Easter Sunday for a given year using the algorithm
 * @param year The year to calculate Easter for
 * @returns Date object for Easter Sunday
 */
function calculateEaster(year: number): Date {
  // Using the anonymous Gregorian algorithm
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  
  return new Date(year, month - 1, day); // month is 0-indexed in Date constructor
}

/**
 * Generate fallback holidays for a year when data.gov.au data is not available
 * @param year The year to generate holidays for
 * @returns Array of DataGovAuHoliday objects
 */
function generateFallbackHolidays(year: number): DataGovAuHoliday[] {
  const holidays: DataGovAuHoliday[] = [];
  const easter = calculateEaster(year);
  
  console.log(`🔄 Generating fallback holidays for ${year} (Easter: ${easter.toISOString().slice(0, 10)})`);
  
  let holidayId = 1;
  
  STANDARD_AUSTRALIAN_HOLIDAYS.forEach(template => {
    let holidayDate: Date;
    
    if (template.date.startsWith('easter')) {
      // Calculate Easter-based holidays
      const offset = parseInt(template.date.split('easter')[1] || '0');
      holidayDate = new Date(easter);
      holidayDate.setDate(easter.getDate() + offset);
    } else {
      // Fixed date holidays
      const [month, day] = template.date.split('-').map(Number);
      holidayDate = new Date(year, month - 1, day);
      
      // Handle observed dates for weekends (simple logic)
      if (holidayDate.getDay() === 0) { // Sunday
        holidayDate.setDate(holidayDate.getDate() + 1); // Move to Monday
      } else if (holidayDate.getDay() === 6) { // Saturday
        holidayDate.setDate(holidayDate.getDate() + 2); // Move to Monday
      }
    }
    
    // Add holiday for each region/jurisdiction
    const jurisdictions = ['nsw', 'vic', 'qld', 'sa', 'wa', 'tas', 'nt', 'act'];
    jurisdictions.forEach(jurisdiction => {
      holidays.push({
        _id: holidayId++,
        Date: holidayDate.toISOString().slice(0, 10).replace(/-/g, ''),
        "Holiday Name": template.name,
        Information: `Fallback holiday generated for ${year}`,
        "More Information": `This holiday was generated as fallback data because data.gov.au does not have ${year} data available yet.`,
        Jurisdiction: jurisdiction,
      });
    });
  });
  
  console.log(`📝 Generated ${holidays.length} fallback holiday records for ${year}`);
  return holidays;
}

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
      affectedRows
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
      affectedRows
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
      affectedRows
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
 * Attempt to fetch holidays from a specific resource ID
 * @param resourceId The data.gov.au resource ID to fetch from
 * @param year The year we're trying to fetch (for filtering and logging)
 * @param jurisdictions Optional array of jurisdictions to filter
 * @returns Promise<DataGovAuHoliday[]>
 */
async function fetchFromResourceId(
  resourceId: string,
  year: number,
  jurisdictions?: string[]
): Promise<DataGovAuHoliday[]> {
  let url = `https://data.gov.au/api/3/action/datastore_search?resource_id=${resourceId}&limit=1000`;
  
  // Add jurisdiction filtering if specified
  if (jurisdictions && jurisdictions.length > 0) {
    const filters = JSON.stringify({ Jurisdiction: jurisdictions });
    url += `&filters=${encodeURIComponent(filters)}`;
  }

  console.log(`🌐 Trying resource ID ${resourceId} for ${year}: ${url}`);
  
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch from resource ${resourceId}: ${response.statusText}`);
  }

  const data = await response.json();
  
  if (!data.success || !data.result || !data.result.records) {
    throw new Error(`Invalid response format from resource ${resourceId}`);
  }

  const holidays = data.result.records as DataGovAuHoliday[];
  
  // Filter by year if we're using a combined dataset
  const filteredHolidays = holidays.filter(holiday => {
    if (!holiday.Date || holiday.Date.length !== 8) return false;
    const holidayYear = parseInt(holiday.Date.substring(0, 4));
    return holidayYear === year;
  });
  
  console.log(`📥 Fetched ${holidays.length} holidays, ${filteredHolidays.length} for year ${year}`);
  
  return filteredHolidays;
}

/**
 * Fetch comprehensive Australian holidays from data.gov.au with fallback strategies
 * @param year Year to fetch holidays for
 * @param jurisdictions Optional array of jurisdictions to filter (e.g., ['nsw', 'act'])
 * @returns Promise<DataGovAuHoliday[]>
 */
export async function fetchDataGovAuHolidays(
  year: number,
  jurisdictions?: string[]
): Promise<DataGovAuHoliday[]> {
  console.log(`🚀 Fetching Australian holidays for ${year} with fallback strategies`);
  
  // Strategy 1: Try year-specific resource ID
  const yearSpecificResourceId = DATA_GOV_AU_RESOURCE_IDS[year];
  if (yearSpecificResourceId) {
    try {
      console.log(`📋 Strategy 1: Using year-specific resource ID for ${year}`);
      const holidays = await fetchFromResourceId(yearSpecificResourceId, year, jurisdictions);
      if (holidays.length > 0) {
        console.log(`✅ Successfully fetched ${holidays.length} holidays using year-specific resource ID`);
        return holidays;
      }
    } catch (error) {
      console.warn(`⚠️ Year-specific resource ID failed for ${year}:`, error instanceof Error ? error.message : String(error));
    }
  } else {
    console.log(`📋 No year-specific resource ID available for ${year}`);
  }
  
  // Strategy 2: Try combined resource ID
  try {
    console.log(`📋 Strategy 2: Trying combined resource ID for ${year}`);
    const holidays = await fetchFromResourceId(DATA_GOV_AU_COMBINED_RESOURCE_ID, year, jurisdictions);
    if (holidays.length > 0) {
      console.log(`✅ Successfully fetched ${holidays.length} holidays from combined dataset`);
      return holidays;
    }
  } catch (error) {
    console.warn(`⚠️ Combined resource ID failed for ${year}:`, error instanceof Error ? error.message : String(error));
  }
  
  // Strategy 3: Try date.nager.at API as fallback
  try {
    console.log(`📋 Strategy 3: Trying date.nager.at API for ${year}`);
    const nagerHolidays = await fetchPublicHolidays(year, 'AU');
    if (nagerHolidays.length > 0) {
      // Convert nager.at format to data.gov.au format with proper regional mapping
      const expandedHolidays: DataGovAuHoliday[] = [];
      const allJurisdictions = ['nsw', 'vic', 'qld', 'sa', 'wa', 'tas', 'nt', 'act'];
      
      nagerHolidays.forEach((holiday, index) => {
        // Determine which jurisdictions this holiday applies to based on nager.at data
        let applicableJurisdictions: string[];
        
        if (holiday.global) {
          // National holidays apply to all states
          applicableJurisdictions = allJurisdictions;
        } else if (holiday.counties && holiday.counties.length > 0) {
          // Map nager.at county codes to Australian jurisdictions
          applicableJurisdictions = holiday.counties.map(county => {
            const countyCode = county.replace('AU-', '').toLowerCase();
            return countyCode || 'nsw'; // Default to NSW if mapping fails
          }).filter(jurisdiction => allJurisdictions.includes(jurisdiction));
        } else {
          // Regional holiday - determine jurisdiction from holiday name
          const holidayName = (holiday.localName || holiday.name).toLowerCase();
          
          if (holidayName.includes('canberra')) {
            applicableJurisdictions = ['act'];
          } else if (holidayName.includes('western australia')) {
            applicableJurisdictions = ['wa'];
          } else if (holidayName.includes('victoria') || holidayName.includes('melbourne') || holidayName.includes('afl')) {
            applicableJurisdictions = ['vic'];
          } else if (holidayName.includes('queensland')) {
            applicableJurisdictions = ['qld'];
          } else if (holidayName.includes('south australia')) {
            applicableJurisdictions = ['sa'];
          } else if (holidayName.includes('tasmania')) {
            applicableJurisdictions = ['tas'];
          } else if (holidayName.includes('northern territory') || holidayName.includes('picnic day')) {
            applicableJurisdictions = ['nt'];
          } else if (holidayName.includes('new south wales')) {
            applicableJurisdictions = ['nsw'];
          } else if (holidayName.includes('labour day') || holidayName.includes('labor day')) {
            // Labour Day varies by state - for now, default to multiple states
            applicableJurisdictions = ['nsw', 'vic', 'qld', 'sa', 'wa', 'tas', 'nt', 'act'];
          } else {
            // Unknown regional holiday - default to all states for safety
            applicableJurisdictions = allJurisdictions;
          }
        }
        
        // Create records for each applicable jurisdiction
        applicableJurisdictions.forEach(jurisdiction => {
          expandedHolidays.push({
            _id: expandedHolidays.length + 1,
            Date: holiday.date.replace(/-/g, ''), // Convert YYYY-MM-DD to YYYYMMDD
            "Holiday Name": holiday.localName || holiday.name,
            Information: `Fetched from date.nager.at API for ${year}`,
            "More Information": `This holiday was fetched from date.nager.at because data.gov.au does not have ${year} data available yet. Original scope: ${holiday.global ? 'National' : 'Regional'}`,
            Jurisdiction: jurisdiction,
          });
        });
      });
      
      console.log(`✅ Successfully fetched ${nagerHolidays.length} holidays from date.nager.at, expanded to ${expandedHolidays.length} records`);
      
      // Apply jurisdiction filtering if specified
      if (jurisdictions && jurisdictions.length > 0) {
        const filtered = expandedHolidays.filter(holiday => jurisdictions.includes(holiday.Jurisdiction));
        console.log(`🔍 Filtered nager.at holidays: ${expandedHolidays.length} → ${filtered.length}`);
        return filtered;
      }
      
      return expandedHolidays;
    }
  } catch (error) {
    console.warn(`⚠️ date.nager.at API failed for ${year}:`, error instanceof Error ? error.message : String(error));
  }
  
  // Strategy 4: Generate fallback holidays (last resort)
  console.log(`📋 Strategy 4: Generating calculated fallback holidays for ${year}`);
  const fallbackHolidays = generateFallbackHolidays(year);
  
  // Apply jurisdiction filtering to fallback data if specified
  if (jurisdictions && jurisdictions.length > 0) {
    const filtered = fallbackHolidays.filter(holiday => jurisdictions.includes(holiday.Jurisdiction));
    console.log(`🔍 Filtered fallback holidays: ${fallbackHolidays.length} → ${filtered.length}`);
    return filtered;
  }
  
  console.log(`🔄 Using ${fallbackHolidays.length} generated fallback holidays for ${year}`);
  return fallbackHolidays;
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
          `✅ Successfully synced ${data.insertHolidays.affectedRows} holidays for ${countryCode} ${year}`
        );

        return {
          success: true,
          affectedRows: data.insertHolidays.affectedRows,
          newHolidays: holidaysToInsert.length,
          message: `Synced ${data.insertHolidays.affectedRows} holidays for ${countryCode} ${year}`,
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
          affectedRows: data.insertHolidays.affectedRows,
          newHolidays: holidaysToInsert.length,
          message: `Synced ${data.insertHolidays.affectedRows} holidays for ${countryCode} ${year} (fallback)`,
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

    // Fetch all Australian holidays from data.gov.au (with fallback)
    const dataGovHolidays = await fetchDataGovAuHolidays(year);
    
    // Determine data source type for logging
    const isGeneratedData = dataGovHolidays.some(h => h.Information?.includes('Fallback holiday generated'));
    const isNagerData = dataGovHolidays.some(h => h.Information?.includes('Fetched from date.nager.at'));
    let dataSource = 'data.gov.au API';
    if (isNagerData) {
      dataSource = 'date.nager.at API';
    } else if (isGeneratedData) {
      dataSource = 'Generated Fallback';
    }
    
    console.log(`📊 Data source for ${year}: ${dataSource}`);
    if (isNagerData) {
      console.log(`🔄 Using date.nager.at API data because ${year} data is not available from data.gov.au`);
    } else if (isGeneratedData) {
      console.log(`⚠️ Using generated fallback data because ${year} data is not available from any external API`);
    }
    
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

      console.log(`✅ Successfully synced ${data.insertHolidays.affectedRows} holidays for AU ${year}`);
      
      return {
        success: true,
        affectedRows: data.insertHolidays.affectedRows,
        totalHolidays: holidaysToInsert.length,
        originalRecordCount: dataGovHolidays.length,
        consolidatedRecordCount: holidaysToInsert.length,
        nationalHolidays: nationalHolidays.length,
        regionalHolidays: regionalHolidays.length,
        eftRelevantHolidays: eftRelevantCount,
        coverageBreakdown: byRegionType,
        message: `Synced ${data.insertHolidays.affectedRows} consolidated Australian holidays for ${year} (${dataGovHolidays.length} → ${holidaysToInsert.length} records, source: ${dataSource})`,
        dataSource,
        isGeneratedData,
        isNagerData,
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

      console.log(`✅ Successfully synced ${data.insertHolidays.affectedRows} holidays for AU ${year} (fallback)`);
      
      return {
        success: true,
        affectedRows: data.insertHolidays.affectedRows,
        totalHolidays: holidaysToInsert.length,
        originalRecordCount: dataGovHolidays.length,
        consolidatedRecordCount: holidaysToInsert.length,
        nationalHolidays: nationalHolidays.length,
        regionalHolidays: regionalHolidays.length,
        eftRelevantHolidays: eftRelevantCount,
        coverageBreakdown: byRegionType,
        message: `Synced ${data.insertHolidays.affectedRows} consolidated Australian holidays for ${year} (fallback, ${dataGovHolidays.length} → ${holidaysToInsert.length} records, source: ${dataSource})`,
        dataSource,
        isGeneratedData,
        isNagerData,
      };
    }
  } catch (error) {
    console.error(`❌ Error syncing comprehensive holidays for AU in ${year}:`, error);
    throw error;
  }
}

export async function syncAustralianHolidays(forceSync: boolean = false) {
  const currentYear = new Date().getFullYear();
  const yearsToSync = [currentYear, currentYear + 1, currentYear + 2]; // Sync current year + 2 future years

  try {
    console.log(
      `🚀 Starting Australian holiday sync for ${yearsToSync.join(', ')}...`
    );

    // Use comprehensive sync for better coverage including future years
    const results = await Promise.all(
      yearsToSync.map(year => syncComprehensiveAustralianHolidays(year, forceSync))
    );

    const totalAffected = results.reduce(
      (sum: number, result: any) => sum + (result.affectedRows || 0),
      0
    );
    const skippedCount = results.filter((result: any) => result.skipped).length;
    const totalEftRelevant = results.reduce(
      (sum: number, result: any) => sum + (result.eftRelevantHolidays || 0),
      0
    );
    const generatedCount = results.filter((result: any) => result.isGeneratedData).length;
    const nagerCount = results.filter((result: any) => result.isNagerData).length;

    console.log(`🎉 Australian holiday sync completed!`);
    console.log(`   Years processed: ${yearsToSync.join(', ')}`);
    console.log(`   Total holidays affected: ${totalAffected}`);
    console.log(`   EFT Relevant holidays: ${totalEftRelevant}`);
    console.log(`   Years skipped (already had data): ${skippedCount}`);
    console.log(`   Years using date.nager.at data: ${nagerCount}`);
    console.log(`   Years using generated data: ${generatedCount}`);

    return {
      success: true,
      results,
      totalAffected,
      totalEftRelevant,
      skippedCount,
      generatedCount,
      nagerCount,
      yearsToSync,
      message: `Australian holiday sync completed: ${totalAffected} holidays processed (${totalEftRelevant} EFT relevant), ${skippedCount} years skipped, ${nagerCount} years using date.nager.at, ${generatedCount} years using generated data`,
    };
  } catch (error) {
    console.error("❌ Failed to sync Australian holidays:", error);
    throw error;
  }
}
