import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './db.js';
import priceUpdater from './utils/priceUpdater.js';
import investmentRoutes from './routes/investments.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', investmentRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Investment Tracker Backend Running',
    priceUpdater: priceUpdater.getStatus()
  });
});

// Price update status endpoint
app.get('/api/price-update/status', (req, res) => {
  res.json(priceUpdater.getStatus());
});

// Manual price update trigger endpoint
app.post('/api/price-update/trigger', async (req, res) => {
  try {
    await priceUpdater.updateAllPrices();
    res.json({ message: 'Price update triggered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to trigger price update' });
  }
});

// Initialize database and start server
const startServer = async () => {
  try {
    await db.initialize();
    console.log('Database initialized successfully');
    
    // Start automatic price updates
    priceUpdater.start();
    
    app.listen(PORT, () => {
      console.log(`🚀 Backend server running on port ${PORT}`);
      console.log(`📊 Database: SQLite (local)`);
      console.log(`🌐 Health check: http://localhost:${PORT}/health`);
      console.log(`📈 Price updates: Automatic every 5 minutes`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();