import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * Scrapes mutual fund NAV from AMFI or fund house websites
 * @param {string} symbol - Mutual fund symbol (e.g., 'HDFC_TOP100', 'SBI_BLUECHIP')
 * @returns {Promise<number>} Current NAV
 */
async function scrapeMFNAV(symbol) {
  try {
    // For demo purposes, we'll simulate NAV fetching with realistic variations
    // In production, you would integrate with AMFI API or scrape fund house websites
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));
    
    // Base NAV prices for demo mutual funds
    const baseNAVs = {
      'HDFC_TOP100': 280,
      'SBI_BLUECHIP': 48,
      'ICICI_LARGECAP': 65,
      'AXIS_MIDCAP': 42,
      'NIPPON_SMALLCAP': 35,
      'FRANKLIN_INDIA': 55,
      'UTI_NIFTY': 120,
      'DSP_EQUITY': 85,
      'KOTAK_SELECT': 78,
      'MIRAE_LARGECAP': 92
    };
    
    const baseNAV = baseNAVs[symbol.toUpperCase()] || 50;
    
    // Add smaller random variation for NAV (±2%)
    const variation = (Math.random() - 0.5) * 0.04; // -2% to +2%
    const currentNAV = Math.round((baseNAV * (1 + variation)) * 100) / 100; // Round to 2 decimal places
    
    console.log(`Fetched MF NAV for ${symbol}: ₹${currentNAV}`);
    return currentNAV;
    
  } catch (error) {
    console.error(`Error fetching MF NAV for ${symbol}:`, error.message);
    // Return null on error so caller can handle gracefully
    return null;
  }
}

/**
 * Scrapes multiple mutual fund NAVs
 * @param {string[]} symbols - Array of mutual fund symbols
 * @returns {Promise<Object>} Object with symbol as key and NAV as value
 */
async function scrapeMultipleMFNAVs(symbols) {
  const results = {};
  
  // Process in batches to avoid overwhelming the server
  const batchSize = 3;
  for (let i = 0; i < symbols.length; i += batchSize) {
    const batch = symbols.slice(i, i + batchSize);
    const promises = batch.map(symbol => 
      scrapeMFNAV(symbol).then(nav => ({ symbol, nav }))
    );
    
    const batchResults = await Promise.all(promises);
    batchResults.forEach(({ symbol, nav }) => {
      results[symbol] = nav;
    });
    
    // Small delay between batches
    if (i + batchSize < symbols.length) {
      await new Promise(resolve => setTimeout(resolve, 150));
    }
  }
  
  return results;
}

/**
 * Gets mutual fund details including NAV, fund house, category
 * @param {string} symbol - Mutual fund symbol
 * @returns {Promise<Object>} Fund details with NAV
 */
async function getMFDetails(symbol) {
  try {
    const nav = await scrapeMFNAV(symbol);
    
    // Demo fund details (in production, this would come from AMFI/fund house APIs)
    const fundDetails = {
      'HDFC_TOP100': {
        name: 'HDFC Top 100 Fund',
        fundHouse: 'HDFC Mutual Fund',
        category: 'Large Cap',
        aum: '₹15,000 Cr'
      },
      'SBI_BLUECHIP': {
        name: 'SBI Blue Chip Fund',
        fundHouse: 'SBI Mutual Fund',
        category: 'Large Cap',
        aum: '₹12,500 Cr'
      }
    };
    
    const details = fundDetails[symbol.toUpperCase()] || {
      name: symbol.replace(/_/g, ' '),
      fundHouse: 'Demo Fund House',
      category: 'Equity',
      aum: '₹5,000 Cr'
    };
    
    return {
      ...details,
      symbol,
      nav,
      lastUpdated: new Date().toISOString()
    };
    
  } catch (error) {
    console.error(`Error fetching MF details for ${symbol}:`, error.message);
    return null;
  }
}

export {
  scrapeMFNAV,
  scrapeMultipleMFNAVs,
  getMFDetails
};