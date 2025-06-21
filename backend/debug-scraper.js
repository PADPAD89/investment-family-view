import axios from 'axios';
import * as cheerio from 'cheerio';

async function debugScreener() {
  try {
    const url = 'https://www.screener.in/company/INFY/';
    console.log(`Fetching: ${url}`);
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      timeout: 15000,
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers['content-type']);
    
    const $ = cheerio.load(response.data);
    
    // Debug: Check different possible selectors
    console.log('\n🔍 Debugging price selectors:');
    
    const selectors = [
      '.company-header .number',
      '.number',
      '.price',
      '.current-price',
      '[data-field="price"]',
      '.company-ratios .number',
      'h1 + .number',
      '.top .number'
    ];
    
    selectors.forEach(selector => {
      const element = $(selector).first();
      const text = element.text().trim();
      console.log(`${selector}: "${text}"`);
    });
    
    // Look for any elements containing numbers that might be prices
    console.log('\n🔍 All elements with .number class:');
    $('.number').each((i, el) => {
      const text = $(el).text().trim();
      console.log(`[${i}] .number: "${text}"`);
    });
    
    // Check for company name to verify we're on the right page
    console.log('\n🔍 Page title and company info:');
    console.log('Title:', $('title').text());
    console.log('H1:', $('h1').text());
    
  } catch (error) {
    console.error('Debug error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data preview:', error.response.data.substring(0, 500));
    }
  }
}

debugScreener();