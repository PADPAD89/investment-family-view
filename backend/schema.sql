-- Investment Tracker Database Schema
-- SQLite database for local development

-- Members table to store family members
CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Investments table to store all investment records
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
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_investments_member_id ON investments(member_id);
CREATE INDEX IF NOT EXISTS idx_investments_symbol ON investments(symbol);
CREATE INDEX IF NOT EXISTS idx_investments_type ON investments(type);
CREATE INDEX IF NOT EXISTS idx_investments_last_updated ON investments(last_updated);

-- Initial seed data
INSERT OR IGNORE INTO members (name) VALUES 
    ('Manas'),
    ('Father'),
    ('Mother');

-- Sample investment data
INSERT OR IGNORE INTO investments (member_id, type, symbol, name, units, buy_price, buy_date, current_price) VALUES 
    (1, 'Equity', 'INFY', 'Infosys Ltd', 10, 1500, '2024-01-01', 1700),
    (1, 'Mutual Fund', 'HDFC_TOP100', 'HDFC Top 100 Fund', 50, 250, '2024-02-15', 280),
    (2, 'Equity', 'TCS', 'Tata Consultancy Services', 5, 3200, '2024-01-20', 3450),
    (3, 'Mutual Fund', 'SBI_BLUECHIP', 'SBI Blue Chip Fund', 100, 45, '2024-03-01', 48),
    (2, 'Equity', 'RELIANCE', 'Reliance Industries', 8, 2400, '2024-02-10', 2650);