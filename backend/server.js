const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Updated CORS for production
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
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend connected successfully!' });
});

// Todo routes
app.get('/api/todos', (req, res) => {
  res.json([
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Learn Express', completed: false },
    { id: 3, text: 'Build Todo App', completed: false }
  ]);
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Todo App Backend API',
    version: '1.0.0',
    endpoints: [
      'GET /api/health',
      'GET /api/test', 
      'GET /api/todos'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});