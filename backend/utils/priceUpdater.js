import cron from 'node-cron';
import db from '../db.js';
import { scrapeMultipleEquityPrices } from '../scraper/scrapeEquityPrice.js';
import { scrapeMultipleMFNAVs } from '../scraper/scrapeMFNAV.js';

class PriceUpdater {
  constructor() {
    this.isRunning = false;
    this.lastUpdateTime = null;
  }

  /**
   * Start automatic price updates
   */
  start() {
    // Update prices every 15 minutes during market hours (9 AM to 3:30 PM IST)
    // For demo purposes, we'll run every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
      await this.updateAllPrices();
    });

    // Also run a full update at market open (9:15 AM IST) and close (3:30 PM IST)
    cron.schedule('15 9 * * 1-5', async () => {
      console.log('Market opened - Running full price update');
      await this.updateAllPrices();
    });

    cron.schedule('30 15 * * 1-5', async () => {
      console.log('Market closed - Running final price update');
      await this.updateAllPrices();
    });

    console.log('Price updater started - automatic updates every 5 minutes');
  }

  /**
   * Update all investment prices
   */
  async updateAllPrices() {
    if (this.isRunning) {
      console.log('Price update already in progress, skipping...');
      return;
    }

    this.isRunning = true;
    const startTime = Date.now();

    try {
      console.log('Starting price update...');

      // Get all investments from database
      const investments = await db.query('SELECT DISTINCT symbol, type FROM investments');
      
      if (investments.length === 0) {
        console.log('No investments found to update');
        return;
      }

      // Separate equity and mutual fund symbols
      const equitySymbols = investments
        .filter(inv => inv.type === 'Equity')
        .map(inv => inv.symbol);
      
      const mfSymbols = investments
        .filter(inv => inv.type === 'Mutual Fund')
        .map(inv => inv.symbol);

      const updatePromises = [];

      // Update equity prices
      if (equitySymbols.length > 0) {
        updatePromises.push(this.updateEquityPrices(equitySymbols));
      }

      // Update mutual fund NAVs
      if (mfSymbols.length > 0) {
        updatePromises.push(this.updateMFPrices(mfSymbols));
      }

      await Promise.all(updatePromises);

      const duration = Date.now() - startTime;
      this.lastUpdateTime = new Date();
      
      console.log(`Price update completed in ${duration}ms`);
      console.log(`Updated ${equitySymbols.length} equity prices and ${mfSymbols.length} MF NAVs`);

    } catch (error) {
      console.error('Error during price update:', error);
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Update equity stock prices
   */
  async updateEquityPrices(symbols) {
    try {
      const prices = await scrapeMultipleEquityPrices(symbols);
      
      for (const [symbol, price] of Object.entries(prices)) {
        if (price !== null) {
          await db.run(
            'UPDATE investments SET current_price = ?, last_updated = CURRENT_TIMESTAMP WHERE symbol = ? AND type = ?',
            [price, symbol, 'Equity']
          );
        }
      }
      
      console.log(`Updated ${Object.keys(prices).length} equity prices`);
    } catch (error) {
      console.error('Error updating equity prices:', error);
    }
  }

  /**
   * Update mutual fund NAVs
   */
  async updateMFPrices(symbols) {
    try {
      const navs = await scrapeMultipleMFNAVs(symbols);
      
      for (const [symbol, nav] of Object.entries(navs)) {
        if (nav !== null) {
          await db.run(
            'UPDATE investments SET current_price = ?, last_updated = CURRENT_TIMESTAMP WHERE symbol = ? AND type = ?',
            [nav, symbol, 'Mutual Fund']
          );
        }
      }
      
      console.log(`Updated ${Object.keys(navs).length} mutual fund NAVs`);
    } catch (error) {
      console.error('Error updating MF NAVs:', error);
    }
  }

  /**
   * Manually trigger price update for specific investment
   */
  async updateSingleInvestment(symbol, type) {
    try {
      let newPrice;
      
      if (type === 'Equity') {
        newPrice = await scrapeEquityPrice(symbol);
      } else if (type === 'Mutual Fund') {
        newPrice = await scrapeMFNAV(symbol);
      }
      
      if (newPrice !== null) {
        await db.run(
          'UPDATE investments SET current_price = ?, last_updated = CURRENT_TIMESTAMP WHERE symbol = ? AND type = ?',
          [newPrice, symbol, type]
        );
        
        console.log(`Updated ${type} ${symbol}: ₹${newPrice}`);
        return newPrice;
      }
      
      return null;
    } catch (error) {
      console.error(`Error updating single investment ${symbol}:`, error);
      return null;
    }
  }

  /**
   * Get last update status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      lastUpdateTime: this.lastUpdateTime,
      nextUpdate: this.isRunning ? 'In progress' : 'Next scheduled update in < 5 minutes'
    };
  }

  /**
   * Stop automatic updates
   */
  stop() {
    // Note: node-cron doesn't provide easy way to stop specific tasks
    // In production, you'd want to store task references and destroy them
    console.log('Price updater stop requested');
  }
}

export default new PriceUpdater();