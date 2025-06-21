import { scrapeMFNAV, getMFDetails } from './scraper/scrapeMFNAV.js';

// Test the AMFI mutual fund NAV scraper
async function testMFScraper() {
  console.log('🔍 Testing AMFI mutual fund NAV scraper...\n');
  
  const testFunds = [
    'HDFC Top 100',
    'SBI Blue Chip',
    'ICICI Prudential',
    'Axis Long Term'
  ];
  
  for (const fundName of testFunds) {
    console.log(`Testing ${fundName}...`);
    try {
      const nav = await scrapeMFNAV(fundName);
      if (nav) {
        console.log(`✅ ${fundName}: ₹${nav}`);
        
        // Also test getting detailed info
        const details = await getMFDetails(fundName);
        if (details) {
          console.log(`   Full name: ${details.schemeName}`);
          console.log(`   Date: ${details.navDate}`);
        }
      } else {
        console.log(`❌ ${fundName}: NAV not found`);
      }
    } catch (error) {
      console.log(`❌ ${fundName}: Error - ${error.message}`);
    }
    console.log('---');
    
    // Add small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

testMFScraper();