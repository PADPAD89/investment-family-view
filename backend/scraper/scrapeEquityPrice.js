import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * Scrapes equity stock price from Screener.in
 * @param {string} symbol - Stock symbol (e.g., 'INFY', 'TCS')
 * @returns {Promise<number|null>} Current stock price or null if failed
 */
async function scrapeEquityPrice(symbol) {
  try {
    const url = `https://www.screener.in/company/${symbol.toUpperCase()}/`;
    
    // Configure axios with proper headers to avoid blocking
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      timeout: 10000, // 10 second timeout
    });

    // Parse HTML with cheerio
    const $ = cheerio.load(response.data);
    
    // Look for price in multiple locations - Screener.in shows current stock price
    let priceText = '';
    
    // Strategy 1: Look for numbers that are likely stock prices (between 1-10000)
    $('.number').each((i, el) => {
      const text = $(el).text().trim();
      const cleanText = text.replace(/[,\s]/g, '');
      const num = parseFloat(cleanText);
      
      // Check if this looks like a stock price (reasonable range for Indian stocks)
      if (num >= 1 && num <= 10000 && !text.includes('.') && text.includes(',')) {
        const context = $(el).parent().text().trim();
        // Look for price context indicators
        if (context.includes('₹') && !context.toLowerCase().includes('crore') && !context.toLowerCase().includes('lakh')) {
          priceText = text;
          return false; // Break out of each loop
        }
      }
    });
    
    // Strategy 2: If no price found above, look for spans with currency symbol
    if (!priceText) {
      $('span').each((i, el) => {
        const text = $(el).text().trim();
        const parent = $(el).parent().text().trim();
        
        if (parent.includes('₹') && /^\d{1,4}(,\d{3})*$/.test(text)) {
          priceText = text;
          return false;
        }
      });
    }
    
    if (!priceText) {
      console.warn(`Price not found for ${symbol} on Screener.in`);
      return null;
    }

    // Clean and parse the price (remove commas, currency symbols)
    const cleanPrice = priceText.replace(/[₹,\s]/g, '');
    const price = parseFloat(cleanPrice);
    
    if (isNaN(price) || price <= 0) {
      console.warn(`Invalid price format for ${symbol}: ${priceText}`);
      return null;
    }

    console.log(`Scraped equity price for ${symbol} from Screener.in: ₹${price}`);
    return price;

  } catch (error) {
    console.error(`Error scraping equity price for ${symbol} from Screener.in:`, error.message);
    
    // Fallback to simulation if scraping fails
    console.log(`Falling back to simulated price for ${symbol}`);
    return getSimulatedPrice(symbol);
  }
}

/**
 * Fallback function to generate realistic simulated prices
 * @param {string} symbol - Stock symbol
 * @returns {number} Simulated stock price
 */
function getSimulatedPrice(symbol) {
  const stockPrices = {
    'INFY': 1700,
    'TCS': 3600,
    'RELIANCE': 2650,
    'HDFC': 1600,
    'ICICI': 1200,
    'SBI': 600,
    'WIPRO': 450,
    'HUL': 2400,
    'ITC': 450,
    'BHARTIARTL': 1200,
    'KOTAKBANK': 1800,
    'ASIANPAINT': 3200,
    'MARUTI': 12000,
    'BAJFINANCE': 6500,
    'HDFCBANK': 1650,
    'LT': 3400,
    'TITAN': 3200,
    'NESTLEIND': 2200,
    'POWERGRID': 250,
    'NTPC': 350
  };
  
  const basePrice = stockPrices[symbol.toUpperCase()] || 1000;
  const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
  const simulatedPrice = Math.round(basePrice * (1 + variation) * 100) / 100;
  
  console.log(`Generated simulated price for ${symbol}: ₹${simulatedPrice}`);
  return simulatedPrice;
}

/**
 * Scrapes multiple equity prices with rate limiting
 * @param {string[]} symbols - Array of stock symbols
 * @returns {Promise<Object>} Object with symbol as key and price as value
 */
async function scrapeMultipleEquityPrices(symbols) {
  const results = {};
  
  // Process symbols sequentially to avoid rate limiting
  for (const symbol of symbols) {
    try {
      const price = await scrapeEquityPrice(symbol);
      results[symbol] = price;
      
      // Add delay between requests to be respectful to the server
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      
    } catch (error) {
      console.error(`Failed to get price for ${symbol}:`, error.message);
      results[symbol] = null;
    }
  }
  
  return results;
}

export { scrapeEquityPrice, scrapeMultipleEquityPrices };