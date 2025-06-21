import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SQLiteDB = sqlite3.verbose().Database;

const DB_PATH = path.join(__dirname, 'db', 'database.sqlite');

class Database {
  constructor() {
    this.db = null;
  }

  async initialize() {
    // Ensure db directory exists
    const dbDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    return new Promise((resolve, reject) => {
      this.db = new SQLiteDB(DB_PATH, (err) => {
        if (err) {
          reject(err);
        } else {
          console.log('Connected to SQLite database');
          this.createTables()
            .then(() => this.seedData())
            .then(resolve)
            .catch(reject);
        }
      });
    });
  }

  async createTables() {
    const createMembersTable = `
      CREATE TABLE IF NOT EXISTS members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const createInvestmentsTable = `
      CREATE TABLE IF NOT EXISTS investments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        member_id INTEGER NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('Equity', 'Mutual Fund')),
        symbol TEXT NOT NULL,
        name TEXT NOT NULL,
        units REAL NOT NULL,
        buy_price REAL NOT NULL,
        buy_date DATE NOT NULL,
        current_price REAL NOT NULL,
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (member_id) REFERENCES members (id) ON DELETE CASCADE
      )
    `;

    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run(createMembersTable, (err) => {
          if (err) reject(err);
        });
        
        this.db.run(createInvestmentsTable, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    });
  }

  async seedData() {
    // Check if data already exists
    const memberCount = await this.query('SELECT COUNT(*) as count FROM members');
    if (memberCount[0].count > 0) {
      console.log('Database already seeded');
      return;
    }

    // Insert initial members
    const members = [
      { name: 'Manas' },
      { name: 'Father' },
      { name: 'Mother' }
    ];

    const memberIds = {};
    for (const member of members) {
      const result = await this.run('INSERT INTO members (name) VALUES (?)', [member.name]);
      memberIds[member.name] = result.lastID;
    }

    // Insert sample investments
    const investments = [
      {
        member_id: memberIds['Manas'],
        type: 'Equity',
        symbol: 'INFY',
        name: 'Infosys Ltd',
        units: 10,
        buy_price: 1500,
        buy_date: '2024-01-01',
        current_price: 1700
      },
      {
        member_id: memberIds['Manas'],
        type: 'Mutual Fund',
        symbol: 'HDFC_TOP100',
        name: 'HDFC Top 100 Fund',
        units: 50,
        buy_price: 250,
        buy_date: '2024-02-15',
        current_price: 280
      },
      {
        member_id: memberIds['Father'],
        type: 'Equity',
        symbol: 'TCS',
        name: 'Tata Consultancy Services',
        units: 5,
        buy_price: 3200,
        buy_date: '2024-01-20',
        current_price: 3450
      },
      {
        member_id: memberIds['Mother'],
        type: 'Mutual Fund',
        symbol: 'SBI_BLUECHIP',
        name: 'SBI Blue Chip Fund',
        units: 100,
        buy_price: 45,
        buy_date: '2024-03-01',
        current_price: 48
      },
      {
        member_id: memberIds['Father'],
        type: 'Equity',
        symbol: 'RELIANCE',
        name: 'Reliance Industries',
        units: 8,
        buy_price: 2400,
        buy_date: '2024-02-10',
        current_price: 2650
      }
    ];

    for (const investment of investments) {
      await this.run(`
        INSERT INTO investments (member_id, type, symbol, name, units, buy_price, buy_date, current_price)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        investment.member_id,
        investment.type,
        investment.symbol,
        investment.name,
        investment.units,
        investment.buy_price,
        investment.buy_date,
        investment.current_price
      ]);
    }

    console.log('Database seeded with initial data');
  }

  async run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ lastID: this.lastID, changes: this.changes });
        }
      });
    });
  }

  async query(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  close() {
    if (this.db) {
      this.db.close();
    }
  }
}

export default new Database();