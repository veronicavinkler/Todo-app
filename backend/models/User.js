const pool = require('../config/database');
const bcrypt = require('bcrypt');

class User {
  static async findByUsername(username) {
    try {
      const result = await pool.query(
        'SELECT id, username, email, password_hash FROM users WHERE username = $1 OR email = $1',
        [username]
      );
      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Database error: ' + error.message);
    }
  }

  static async findById(id) {
    try {
      const result = await pool.query(
        'SELECT id, username, email FROM users WHERE id = $1',
        [id]
      );
      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Database error: ' + error.message);
    }
  }

  static async create(username, email, password) {
    try {
      const existingUser = await pool.query(
        'SELECT id FROM users WHERE username = $1 OR email = $2',
        [username, email]
      );
      if (existingUser.rows.length > 0) {
        throw new Error('Username or email already exists');
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const result = await pool.query(
        'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email',
        [username, email, passwordHash]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error('Database error: ' + error.message);
    }
  }

  static async validatePassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      throw new Error('Password validation error');
    }
  }

  static async getUserStats(userId) {
    try {
      const result = await pool.query(`
        SELECT 
          u.username,
          u.email,
          u.created_at,
          COUNT(t.id) as total_todos,
          COUNT(CASE WHEN t.completed = true THEN 1 END) as completed_todos
        FROM users u
        LEFT JOIN todos t ON u.id = t.user_id
        WHERE u.id = $1
        GROUP BY u.id, u.username, u.email, u.created_at
      `, [userId]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Database error: ' + error.message);
    }
  }
}

module.exports = User;