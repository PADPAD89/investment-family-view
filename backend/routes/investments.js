import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET /api/members - Get all members
router.get('/members', async (req, res) => {
  try {
    const members = await db.query('SELECT * FROM members ORDER BY name');
    res.json(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/members - Add a new member
router.post('/members', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Member name is required' });
    }
    
    const result = await db.run('INSERT INTO members (name) VALUES (?)', [name.trim()]);
    const newMember = await db.get('SELECT * FROM members WHERE id = ?', [result.lastID]);
    res.status(201).json(newMember);
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.status(409).json({ error: 'Member name already exists' });
    } else {
      console.error('Error creating member:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// PUT /api/members/:id - Update member name
router.put('/members/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Member name is required' });
    }
    
    await db.run('UPDATE members SET name = ? WHERE id = ?', [name.trim(), id]);
    const updatedMember = await db.get('SELECT * FROM members WHERE id = ?', [id]);
    
    if (!updatedMember) {
      return res.status(404).json({ error: 'Member not found' });
    }
    
    res.json(updatedMember);
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.status(409).json({ error: 'Member name already exists' });
    } else {
      console.error('Error updating member:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// DELETE /api/members/:id - Delete member and their investments
router.delete('/members/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.run('DELETE FROM members WHERE id = ?', [id]);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }
    
    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    console.error('Error deleting member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/investments - Get all investments with member info
router.get('/investments', async (req, res) => {
  try {
    const investments = await db.query(`
      SELECT 
        i.*,
        m.name as member_name
      FROM investments i
      JOIN members m ON i.member_id = m.id
      ORDER BY i.last_updated DESC
    `);
    res.json(investments);
  } catch (error) {
    console.error('Error fetching investments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/investments/member/:memberId - Get investments for specific member
router.get('/investments/member/:memberId', async (req, res) => {
  try {
    const { memberId } = req.params;
    const investments = await db.query(`
      SELECT 
        i.*,
        m.name as member_name
      FROM investments i
      JOIN members m ON i.member_id = m.id
      WHERE i.member_id = ?
      ORDER BY i.last_updated DESC
    `, [memberId]);
    res.json(investments);
  } catch (error) {
    console.error('Error fetching member investments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/investments - Add new investment
router.post('/investments', async (req, res) => {
  try {
    const { member_id, type, symbol, name, units, buy_price, buy_date, current_price } = req.body;
    
    // Validate required fields
    if (!member_id || !type || !symbol || !name || !units || !buy_price || !buy_date) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Validate type
    if (!['Equity', 'Mutual Fund'].includes(type)) {
      return res.status(400).json({ error: 'Type must be either Equity or Mutual Fund' });
    }
    
    const result = await db.run(`
      INSERT INTO investments (member_id, type, symbol, name, units, buy_price, buy_date, current_price)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [member_id, type, symbol, name, units, buy_price, buy_date, current_price || buy_price]);
    
    const newInvestment = await db.get(`
      SELECT 
        i.*,
        m.name as member_name
      FROM investments i
      JOIN members m ON i.member_id = m.id
      WHERE i.id = ?
    `, [result.lastID]);
    
    res.status(201).json(newInvestment);
  } catch (error) {
    console.error('Error creating investment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/investments/:id - Update investment
router.put('/investments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { member_id, type, symbol, name, units, buy_price, buy_date, current_price } = req.body;
    
    await db.run(`
      UPDATE investments 
      SET member_id = ?, type = ?, symbol = ?, name = ?, units = ?, 
          buy_price = ?, buy_date = ?, current_price = ?, last_updated = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [member_id, type, symbol, name, units, buy_price, buy_date, current_price, id]);
    
    const updatedInvestment = await db.get(`
      SELECT 
        i.*,
        m.name as member_name
      FROM investments i
      JOIN members m ON i.member_id = m.id
      WHERE i.id = ?
    `, [id]);
    
    if (!updatedInvestment) {
      return res.status(404).json({ error: 'Investment not found' });
    }
    
    res.json(updatedInvestment);
  } catch (error) {
    console.error('Error updating investment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/investments/:id - Delete investment
router.delete('/investments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.run('DELETE FROM investments WHERE id = ?', [id]);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Investment not found' });
    }
    
    res.json({ message: 'Investment deleted successfully' });
  } catch (error) {
    console.error('Error deleting investment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;