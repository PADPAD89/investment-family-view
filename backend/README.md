# Investment Tracker Backend

Local Node.js backend with SQLite database for the Investment Tracker application.

## Structure

```
backend/
├── db/
│   └── database.sqlite          # SQLite database file (created automatically)
├── routes/
│   └── investments.js           # API routes for investments and members
├── scraper/
│   ├── scrapeEquityPrice.js     # Equity price scraping logic
│   └── scrapeMFNAV.js          # Mutual fund NAV scraping logic
├── utils/
│   └── priceUpdater.js         # Automatic price update scheduler
├── server.js                   # Main server entry point
├── db.js                       # SQLite database connection and setup
└── schema.sql                  # Database schema definition
```

## Features

- **SQLite Database**: Local database with automatic schema creation and seeding
- **RESTful API**: Complete CRUD operations for members and investments
- **Automatic Price Updates**: Scheduled price updates every 5 minutes
- **Price Scraping**: Simulated equity and mutual fund price fetching
- **CORS Enabled**: Ready for frontend integration

## API Endpoints

### Members
- `GET /api/members` - Get all members
- `POST /api/members` - Add new member
- `PUT /api/members/:id` - Update member name
- `DELETE /api/members/:id` - Delete member and their investments

### Investments
- `GET /api/investments` - Get all investments with member info
- `GET /api/investments/member/:memberId` - Get investments for specific member
- `POST /api/investments` - Add new investment
- `PUT /api/investments/:id` - Update investment
- `DELETE /api/investments/:id` - Delete investment

### Price Updates
- `GET /api/price-update/status` - Get price updater status
- `POST /api/price-update/trigger` - Manually trigger price update

## Database Schema

### Members Table
- `id` (INTEGER PRIMARY KEY)
- `name` (TEXT UNIQUE)
- `created_at` (DATETIME)

### Investments Table
- `id` (INTEGER PRIMARY KEY)
- `member_id` (INTEGER, FK to members)
- `type` (TEXT: 'Equity' or 'Mutual Fund')
- `symbol` (TEXT)
- `name` (TEXT)
- `units` (REAL)
- `buy_price` (REAL)
- `buy_date` (DATE)
- `current_price` (REAL)
- `last_updated` (DATETIME)

## Running the Backend

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Start the server:
   ```bash
   node server.js
   ```

3. The server will run on port 3001 by default
4. Database will be automatically created and seeded with sample data
5. Price updates will start automatically every 5 minutes

## Health Check

Visit `http://localhost:3001/health` to verify the backend is running.

## Sample Data

The database is automatically seeded with:
- 3 family members (Manas, Father, Mother)
- 5 sample investments (mix of equity and mutual funds)
- Realistic price variations for demo purposes