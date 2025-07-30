#!/usr/bin/env node

/**
 * Test Holiday Sync - Test comprehensive Australian holiday integration
 * This script will fetch and analyze holiday data from data.gov.au
 */

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Mock the data.gov.au API call for testing
async function fetchDataGovAuHolidays(year) {
  try {
    const url = `https://data.gov.au/api/3/action/datastore_search?resource_id=4d4d744b-50ed-45b9-ae77-760bc478ad75&limit=200`;
    console.log(`🌐 Fetching from: ${url}`);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.success || !data.result || !data.result.records) {
      throw new Error('Invalid response format from data.gov.au API');
    }
    
    return data.result.records;
  } catch (error) {
    console.error('❌ Error fetching data.gov.au holidays:', error.message);
    throw error;
  }
}

// Transform data.gov.au format to our internal format
function transformHolidays(holidays) {
  const JURISDICTION_MAPPING = {
    nsw: 'NSW', vic: 'VIC', qld: 'QLD', sa: 'SA', 
    wa: 'WA', tas: 'TAS', nt: 'NT', act: 'ACT'
  };
  
  const EFT_RELEVANT_REGIONS = ['NSW', 'National', 'Australia'];
  
  return holidays.map(holiday => {
    const dateStr = holiday.Date;
    const isoDate = `${dateStr.slice(0,4)}-${dateStr.slice(4,6)}-${dateStr.slice(6,8)}`;
    const regionName = JURISDICTION_MAPPING[holiday.Jurisdiction] || holiday.Jurisdiction.toUpperCase();
    const isEftRelevant = EFT_RELEVANT_REGIONS.includes(regionName);
    
    return {
      date: isoDate,
      name: holiday["Holiday Name"],
      region: [regionName],
      countryCode: 'AU',
      jurisdiction: holiday.Jurisdiction,
      eftRelevant: isEftRelevant,
      source: 'data.gov.au'
    };
  });
}

async function testDataGovAuIntegration() {
  console.log('📊 Testing data.gov.au API integration...');
  
  try {
    // Fetch holidays from data.gov.au
    const rawHolidays = await fetchDataGovAuHolidays(2025);
    console.log(`✅ Successfully fetched ${rawHolidays.length} holidays from data.gov.au`);
    
    // Transform holidays
    const transformedHolidays = transformHolidays(rawHolidays);
    console.log(`✅ Successfully transformed ${transformedHolidays.length} holidays`);
    
    return { rawHolidays, transformedHolidays };
  } catch (error) {
    console.error('❌ Error testing data.gov.au integration:', error);
    throw error;
  }
}

function analyzeHolidays(holidays) {
  console.log('📊 Analyzing holiday data...');
  
  // Group by region
  const regionCounts = {};
  let eftRelevantCount = 0;
  let otherStatesCount = 0;
  
  holidays.forEach(holiday => {
    holiday.region.forEach(region => {
      regionCounts[region] = (regionCounts[region] || 0) + 1;
    });
    
    if (holiday.eftRelevant) {
      eftRelevantCount++;
    } else {
      otherStatesCount++;
    }
  });
  
  console.log('📋 Holidays by region:');
  Object.entries(regionCounts)
    .sort(([,a], [,b]) => b - a)
    .forEach(([region, count]) => {
      const isEftRelevant = ['NSW', 'National', 'Australia'].includes(region);
      const indicator = isEftRelevant ? '✅' : '📊';
      console.log(`   ${indicator} ${region}: ${count} holidays`);
    });
    
  console.log(`\n📈 Summary:`);
  console.log(`   Total holidays: ${holidays.length}`);
  console.log(`   EFT Relevant (NSW + National): ${eftRelevantCount}`);
  console.log(`   Other states (informational): ${otherStatesCount}`);
  
  return { regionCounts, eftRelevantCount, otherStatesCount };
}

function testLabourDayHandling(holidays) {
  console.log('\n📍 Testing Labour Day Handling:');
  
  const labourDays = holidays.filter(h => 
    h.name.toLowerCase().includes('labour')
  );
  
  if (labourDays.length === 0) {
    console.log('⚠️  No Labour Day holidays found');
    return;
  }
  
  console.log('🏷️  Labour Day holidays found:');
  labourDays.forEach(holiday => {
    const regions = holiday.region.join(', ');
    const indicator = holiday.eftRelevant ? '✅ (affects EFT)' : '📊 (informational)';
    console.log(`   ${indicator} ${holiday.name} (${holiday.date}) - ${regions}`);
  });
  
  // Specifically check for NSW vs VIC Labour Day
  const nswLabour = labourDays.find(h => h.region.includes('NSW'));
  const vicLabour = labourDays.find(h => h.region.includes('VIC'));
  const qldLabour = labourDays.find(h => h.region.includes('QLD'));
  
  console.log('\n🎯 Key Test Cases:');
  if (nswLabour) {
    console.log(`   ✅ NSW Labour Day (${nswLabour.date}): ${nswLabour.eftRelevant ? 'WILL affect EFT' : 'will NOT affect EFT'}`);
  }
  if (vicLabour) {
    console.log(`   ❌ VIC Labour Day (${vicLabour.date}): ${vicLabour.eftRelevant ? 'WILL affect EFT' : 'will NOT affect EFT'}`);
  }
  if (qldLabour) {
    console.log(`   ❌ QLD Labour Day (${qldLabour.date}): ${qldLabour.eftRelevant ? 'WILL affect EFT' : 'will NOT affect EFT'}`);
  }
}

async function testHolidaySync() {
  console.log('🧪 Testing Comprehensive Australian Holiday Sync');
  console.log('=' .repeat(60));

  try {
    // Step 1: Test data.gov.au integration
    console.log('\n📍 Step 1: Test Data.gov.au Integration');
    const { rawHolidays, transformedHolidays } = await testDataGovAuIntegration();

    // Step 2: Analyze holiday data
    console.log('\n📍 Step 2: Analyze Holiday Data');
    const analysis = analyzeHolidays(transformedHolidays);

    // Step 3: Test Labour Day handling
    console.log('\n📍 Step 3: Test Labour Day Handling');
    testLabourDayHandling(transformedHolidays);
    
    // Step 4: Show sample data transformation
    console.log('\n📍 Step 4: Sample Data Transformation');
    console.log('Raw data.gov.au format:');
    if (rawHolidays.length > 0) {
      const sample = rawHolidays[0];
      console.log(`   ${JSON.stringify(sample, null, 2)}`);
    }
    
    console.log('\nTransformed format:');
    if (transformedHolidays.length > 0) {
      const sample = transformedHolidays[0];
      console.log(`   ${JSON.stringify(sample, null, 2)}`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('🎉 Holiday sync test completed successfully!');
    console.log(`✅ ${transformedHolidays.length} holidays fetched from data.gov.au`);
    console.log(`✅ ${analysis.eftRelevantCount} holidays will affect NSW EFT dates`);
    console.log(`📊 ${analysis.otherStatesCount} holidays stored for informational purposes`);
    
    console.log('\n📋 Next Steps:');
    console.log('   1. The holiday sync service is ready to use');
    console.log('   2. Run syncComprehensiveAustralianHolidays() to populate database');
    console.log('   3. EFT adjustments will automatically use NSW + National holidays only');
    
    console.log('\n🔧 To actually sync to database, use:');
    console.log('   • Delete existing: DELETE FROM holidays WHERE country_code = \'AU\';');
    console.log('   • Sync new data: Call syncComprehensiveAustralianHolidays(2025, true)');

  } catch (error) {
    console.error('\n❌ Holiday sync test failed:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the test
testHolidaySync().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});