const pool = require('./db');

const createTodosTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        text VARCHAR(255) NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Todos table created successfully');
    
    // Check if table is empty and add sample data
    const { rows } = await pool.query('SELECT COUNT(*) FROM todos');
    if (parseInt(rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO todos (text, completed) VALUES
        ('Drink water', false),
        ('Take a walk', false),
        ('Study', false)
      `);
      console.log('Sample todos added');
    }
  } catch (error) {
    console.error('Error creating table:', error);
  }
};

module.exports = { createTodosTable };