import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * Scrapes equity stock price from NSE/BSE websites
 * @param {string} symbol - Stock symbol (e.g., 'INFY', 'TCS')
 * @returns {Promise<number>} Current stock price
 */
async function scrapeEquityPrice(symbol) {
  try {
    // For demo purposes, we'll simulate price fetching with random variations
    // In a real implementation, you would scrape from actual financial websites
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    // Base prices for demo stocks (you can expand this)
    const basePrices = {
      'INFY': 1700,
      'TCS': 3450,
      'RELIANCE': 2650,
      'WIPRO': 420,
      'HDFCBANK': 1550,
      'ICICIBANK': 750,
      'SBIN': 600,
      'ITC': 425,
      'HINDUNILVR': 2400,
      'BHARTIARTL': 850
    };
    
    const basePrice = basePrices[symbol.toUpperCase()] || 1000;
    
    // Add random variation of ±5%
    const variation = (Math.random() - 0.5) * 0.1; // -5% to +5%
    const currentPrice = Math.round(basePrice * (1 + variation));
    
    console.log(`Fetched equity price for ${symbol}: ₹${currentPrice}`);
    return currentPrice;
    
  } catch (error) {
    console.error(`Error fetching equity price for ${symbol}:`, error.message);
    // Return null on error so caller can handle gracefully
    return null;
  }
}

/**
 * Scrapes multiple equity prices
 * @param {string[]} symbols - Array of stock symbols
 * @returns {Promise<Object>} Object with symbol as key and price as value
 */
async function scrapeMultipleEquityPrices(symbols) {
  const results = {};
  
  // Process in batches to avoid overwhelming the server
  const batchSize = 5;
  for (let i = 0; i < symbols.length; i += batchSize) {
    const batch = symbols.slice(i, i + batchSize);
    const promises = batch.map(symbol => 
      scrapeEquityPrice(symbol).then(price => ({ symbol, price }))
    );
    
    const batchResults = await Promise.all(promises);
    batchResults.forEach(({ symbol, price }) => {
      results[symbol] = price;
    });
    
    // Small delay between batches
    if (i + batchSize < symbols.length) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
  
  return results;
}

export {
  scrapeEquityPrice,
  scrapeMultipleEquityPrices
};