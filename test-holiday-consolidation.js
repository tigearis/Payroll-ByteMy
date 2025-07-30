// Test script to demonstrate holiday consolidation logic
const sampleHolidays = [
  // New Year's Day - appears in all states (should become National)
  { _id: 1, Date: "20250101", "Holiday Name": "New Year's Day", Jurisdiction: "nsw" },
  { _id: 2, Date: "20250101", "Holiday Name": "New Year's Day", Jurisdiction: "vic" },
  { _id: 3, Date: "20250101", "Holiday Name": "New Year's Day", Jurisdiction: "qld" },
  { _id: 4, Date: "20250101", "Holiday Name": "New Year's Day", Jurisdiction: "sa" },
  { _id: 5, Date: "20250101", "Holiday Name": "New Year's Day", Jurisdiction: "wa" },
  { _id: 6, Date: "20250101", "Holiday Name": "New Year's Day", Jurisdiction: "tas" },
  { _id: 7, Date: "20250101", "Holiday Name": "New Year's Day", Jurisdiction: "nt" },
  { _id: 8, Date: "20250101", "Holiday Name": "New Year's Day", Jurisdiction: "act" },
  
  // Canberra Day - only in ACT (should remain regional)
  { _id: 9, Date: "20250310", "Holiday Name": "Canberra Day", Jurisdiction: "act" },
  
  // Labour Day - different dates in different states (separate records)
  { _id: 10, Date: "20250310", "Holiday Name": "Labour Day", Jurisdiction: "vic" },
  { _id: 11, Date: "20250505", "Holiday Name": "Labour Day", Jurisdiction: "qld" },
  { _id: 12, Date: "20250505", "Holiday Name": "May Day", Jurisdiction: "nt" },
];

const JURISDICTION_MAPPING = {
  nsw: 'NSW', vic: 'VIC', qld: 'QLD', sa: 'SA',
  wa: 'WA', tas: 'TAS', nt: 'NT', act: 'ACT'
};

function simulateConsolidation(holidays) {
  // Group by date
  const groupedByDate = holidays.reduce((acc, holiday) => {
    const dateKey = holiday.Date;
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(holiday);
    return acc;
  }, {});

  console.log('🔄 Original holidays:', holidays.length);
  console.log('📅 Unique dates:', Object.keys(groupedByDate).length);
  console.log('');

  // Process each date group
  Object.entries(groupedByDate).forEach(([date, holidaysForDate]) => {
    const regions = holidaysForDate.map(h => JURISDICTION_MAPPING[h.Jurisdiction]);
    const uniqueRegions = [...new Set(regions)].sort();
    
    const allRegions = ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT'];
    const isNational = uniqueRegions.length === allRegions.length;
    
    const isoDate = `${date.slice(0,4)}-${date.slice(4,6)}-${date.slice(6,8)}`;
    const holidayName = holidaysForDate[0]["Holiday Name"];
    
    console.log(`📆 ${isoDate} - ${holidayName}`);
    console.log(`   Original records: ${holidaysForDate.length}`);
    console.log(`   Jurisdictions: ${holidaysForDate.map(h => h.Jurisdiction).sort().join(', ')}`);
    console.log(`   Consolidated: ${isNational ? 'National' : uniqueRegions.join(', ')}`);
    console.log(`   ${isNational ? '🇦🇺 NATIONAL HOLIDAY' : '🏛️ Regional holiday'}`);
    console.log('');
  });
}

console.log('🧪 Holiday Consolidation Simulation\n');
simulateConsolidation(sampleHolidays);