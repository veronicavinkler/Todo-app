const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db');
const { createTodosTable } = require('./init-db');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize database on startup
createTodosTable();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [
        process.env.FRONTEND_URL,
        /\.vercel\.app$/,
        /\.netlify\.app$/
      ]
    : 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT NOW()');
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      database: 'Connected'
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'Error', 
      database: 'Disconnected',
      error: error.message 
    });
  }
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend connected successfully!' });
});

// Get all todos
app.get('/api/todos', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM todos ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// Create new todo
app.post('/api/todos', async (req, res) => {
  try {
    const { text } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO todos (text) VALUES ($1) RETURNING *',
      [text]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// Update todo (toggle completion)
app.put('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;
    const { rows } = await pool.query(
      'UPDATE todos SET completed = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [completed, id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// Delete todo
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      'DELETE FROM todos WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Todo App Backend API with PostgreSQL',
    version: '2.0.0',
    database: 'Neon PostgreSQL',
    endpoints: [
      'GET /api/health',
      'GET /api/test', 
      'GET /api/todos',
      'POST /api/todos',
      'PUT /api/todos/:id',
      'DELETE /api/todos/:id'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('Database: PostgreSQL via Neon');
});