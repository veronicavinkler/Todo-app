const express = require('express');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

// Import configurations
const sessionConfig = require('./config/session');

// Import utilities
const { initializeDatabase } = require('./utils/initDatabase');

// Import routes
const apiRoutes = require('./routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize database on startup
initializeDatabase().catch(console.error);

// Session middleware
app.use(session(sessionConfig));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL, /\.vercel\.app$/, /\.netlify\.app$/]
    : 'http://localhost:3000',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API routes
app.use('/api', apiRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Todo App Backend API - Organized Structure',
    version: '3.0.0',
    database: 'PostgreSQL with User Authentication',
    features: [
      'User Registration & Authentication',
      'Personal Todo Lists',
      'CRUD Operations',
      'Input Validation',
      'Session Management',
      'Organized Code Structure'
    ],
    endpoints: {
      auth: [
        'POST /api/auth/register',
        'POST /api/auth/login',
        'POST /api/auth/logout',
        'GET /api/auth/me',
        'GET /api/auth/profile'
      ],
      todos: [
        'GET /api/todos',
        'GET /api/todos/stats',
        'GET /api/todos/:id',
        'POST /api/todos',
        'PUT /api/todos/:id',
        'DELETE /api/todos/:id',
        'DELETE /api/todos (completed)'
      ],
      utility: [
        'GET /api/health',
        'GET /api/test'
      ]
    }
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    message: `${req.method} ${req.originalUrl} is not a valid endpoint`
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️ Database: PostgreSQL via Neon`);
  console.log(`🏗️ Architecture: Organized MVC Structure`);
  console.log(`📍 API Documentation: GET /`);
});