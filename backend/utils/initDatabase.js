
const pool = require('../config/database');
const bcrypt = require('bcrypt');

const initializeDatabase = async () => {
  try {
    console.log('Initializing database...');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        text VARCHAR(255) NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS "session" (
        "sid" varchar NOT NULL COLLATE "default",
        "sess" json NOT NULL,
        "expire" timestamp(6) NOT NULL
      )
      WITH (OIDS=FALSE);
      
      ALTER TABLE "session" 
      ADD CONSTRAINT "session_pkey" 
      PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
      
      CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
    `);
    
    console.log('Database tables created successfully');
    
    const { rows } = await pool.query('SELECT COUNT(*) FROM users');
    if (parseInt(rows[0].count) === 0) {
      console.log('Creating demo user...');
      
      const hashedPassword = await bcrypt.hash('demo123', 10);
      const userResult = await pool.query(`
        INSERT INTO users (username, email, password_hash) 
        VALUES ('demo', 'demo@example.com', $1) 
        RETURNING id
      `, [hashedPassword]);
      
      const userId = userResult.rows[0].id;
      
      await pool.query(`
        INSERT INTO todos (user_id, text, completed) VALUES
        ($1, 'Learn React', false),
        ($1, 'Learn Express', false),
        ($1, 'Build Todo App', false),
        ($1, 'Organize code structure', true)
      `, [userId]);
      
      console.log('Demo user and todos created');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

module.exports = { initializeDatabase };