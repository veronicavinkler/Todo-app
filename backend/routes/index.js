const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const todoRoutes = require('./todos');

router.use('/auth', authRoutes);
router.use('/todos', todoRoutes);

router.get('/health', async (req, res) => {
  try {
    const pool = require('../config/database');
    await pool.query('SELECT NOW()');
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      database: 'Connected',
      authenticated: !!req.session?.userId
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'Error', 
      database: 'Disconnected',
      error: error.message 
    });
  }
});

router.get('/test', (req, res) => {
  res.json({ 
    message: 'Backend connected successfully!',
    authenticated: !!req.session?.userId,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;