import { scrapeEquityPrice } from './scraper/scrapeEquityPrice.js';

// Test the Screener.in scraper with popular Indian stocks
async function testScraper() {
  console.log('🔍 Testing Screener.in equity price scraper...\n');
  
  const testSymbols = ['INFY', 'TCS', 'RELIANCE'];
  
  for (const symbol of testSymbols) {
    console.log(`Testing ${symbol}...`);
    try {
      const price = await scrapeEquityPrice(symbol);
      if (price) {
        console.log(`✅ ${symbol}: ₹${price}`);
      } else {
        console.log(`❌ ${symbol}: Failed to get price`);
      }
    } catch (error) {
      console.log(`❌ ${symbol}: Error - ${error.message}`);
    }
    console.log('---');
    
    // Add delay between requests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

testScraper();