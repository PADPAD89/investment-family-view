import db from './db.js';
import priceUpdater from './utils/priceUpdater.js';

// Test the complete price update system with real data sources
async function testFullUpdate() {
  console.log('🧪 Testing complete price update system with real data sources\n');
  
  try {
    // Initialize database
    await db.initialize();
    
    // Get current prices before update
    console.log('📊 Prices before update:');
    const beforePrices = await db.query('SELECT symbol, type, current_price, last_updated FROM investments');
    beforePrices.forEach(inv => {
      console.log(`  ${inv.symbol} (${inv.type}): ₹${inv.current_price} - ${inv.last_updated}`);
    });
    
    console.log('\n🔄 Running price update...');
    
    // Run the price update
    await priceUpdater.updateAllPrices();
    
    // Get prices after update
    console.log('\n📊 Prices after update:');
    const afterPrices = await db.query('SELECT symbol, type, current_price, last_updated FROM investments');
    afterPrices.forEach(inv => {
      console.log(`  ${inv.symbol} (${inv.type}): ₹${inv.current_price} - ${inv.last_updated}`);
    });
    
    // Compare changes
    console.log('\n📈 Price changes:');
    beforePrices.forEach(before => {
      const after = afterPrices.find(a => a.symbol === before.symbol);
      if (after && after.current_price !== before.current_price) {
        const change = after.current_price - before.current_price;
        const changePercent = ((change / before.current_price) * 100).toFixed(2);
        console.log(`  ${before.symbol}: ₹${before.current_price} → ₹${after.current_price} (${change > 0 ? '+' : ''}${changePercent}%)`);
      }
    });
    
    console.log('\n✅ Full price update test completed');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    db.close();
    process.exit(0);
  }
}

testFullUpdate();