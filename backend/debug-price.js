import axios from 'axios';
import * as cheerio from 'cheerio';

async function debugPriceLocation() {
  try {
    const url = 'https://www.screener.in/company/INFY/';
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      timeout: 15000,
    });

    const $ = cheerio.load(response.data);
    
    // Look for price in different locations
    console.log('🔍 Looking for stock price in various locations:');
    
    // Check if there's a price near the company name
    console.log('\n--- Company header area ---');
    const companyHeader = $('.company-header');
    console.log('Company header HTML:', companyHeader.html()?.substring(0, 500));
    
    // Look for price patterns (numbers that look like stock prices)
    console.log('\n--- Price-like numbers ---');
    $('.number').each((i, el) => {
      const text = $(el).text().trim();
      const cleanText = text.replace(/[,\s]/g, '');
      const num = parseFloat(cleanText);
      
      // Stock prices are typically between 1 and 10000 for Indian stocks
      if (num >= 1 && num <= 10000 && !text.includes('.')) {
        const context = $(el).parent().text().trim();
        console.log(`Possible price [${i}]: "${text}" (${num}) - Context: "${context.substring(0, 100)}"`);
      }
    });
    
    // Check for spans with price-like content
    console.log('\n--- Checking spans for price ---');
    $('span').each((i, el) => {
      const text = $(el).text().trim();
      if (/^\d{1,5}(\.\d{1,2})?$/.test(text)) {
        const context = $(el).parent().text().trim();
        console.log(`Span price candidate: "${text}" - Context: "${context.substring(0, 100)}"`);
      }
    });
    
    // Look for specific price indicators
    console.log('\n--- Looking for price indicators ---');
    const priceKeywords = ['price', 'current', 'market', 'quote', 'last'];
    priceKeywords.forEach(keyword => {
      const elements = $(`*:contains("${keyword}")`);
      if (elements.length > 0) {
        console.log(`Found "${keyword}" in ${elements.length} elements`);
        elements.slice(0, 3).each((i, el) => {
          const text = $(el).text().trim();
          console.log(`  "${keyword}" context: "${text.substring(0, 150)}"`);
        });
      }
    });

  } catch (error) {
    console.error('Debug error:', error.message);
  }
}

debugPriceLocation();