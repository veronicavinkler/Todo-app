const pool = require('../config/database');

class Todo {
  static async findByUserId(userId, options = {}) {
    try {
      let query = 'SELECT * FROM todos WHERE user_id = $1';
      const params = [userId];

      if (options.completed !== undefined) {
        query += ' AND completed = $2';
        params.push(options.completed);
      }

      const sortBy = options.sortBy || 'created_at';
      const sortOrder = options.sortOrder || 'DESC';
      query += ` ORDER BY ${sortBy} ${sortOrder}`;

      if (options.limit) {
        query += ` LIMIT $${params.length + 1}`;
        params.push(options.limit);
      }
      if (options.offset) {
        query += ` OFFSET $${params.length + 1}`;
        params.push(options.offset);
      }
      const result = await pool.query(query, params);
      return result.rows;
    } catch (error) {
      throw new Error('Database error: ' + error.message);
    }
  }

  static async findById(id, userId) {
    try {
      const result = await pool.query(
        'SELECT * FROM todos WHERE id = $1 AND user_id = $2',
        [id, userId]
      );
      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Database error: ' + error.message);
    }
  }

  static async create(userId, text) {
    try {
      if (!text || !text.trim()) {
        throw new Error('Todo text is required');
      }
      const result = await pool.query(
        'INSERT INTO todos (user_id, text) VALUES ($1, $2) RETURNING *',
        [userId, text.trim()]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error('Database error: ' + error.message);
    }
  }

  static async update(id, userId, updates) {
    try {
      const allowedUpdates = ['text', 'completed'];
      const updateFields = [];
      const params = [];
      let paramCount = 1;

      for (const [key, value] of Object.entries(updates)) {
        if (allowedUpdates.includes(key)) {
          if (key === 'text' && (!value || !value.trim())) {
            throw new Error('Todo text cannot be empty');
          }
          updateFields.push(`${key} = $${paramCount}`);
          params.push(key === 'text' ? value.trim() : value);
          paramCount++;
        }
      }
      if (updateFields.length === 0) {
        throw new Error('No valid fields to update');
      }
      const query = `
        UPDATE todos 
        SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP 
        WHERE id = $${paramCount} AND user_id = $${paramCount + 1} 
        RETURNING *
      `;
      params.push(id, userId);

      const result = await pool.query(query, params);
      
      if (result.rows.length === 0) {
        throw new Error('Todo not found or not authorized');
      }
      return result.rows[0];
    } catch (error) {
      throw new Error('Database error: ' + error.message);
    }
  }

  static async delete(id, userId) {
    try {
      const result = await pool.query(
        'DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING *',
        [id, userId]
      );
      if (result.rows.length === 0) {
        throw new Error('Todo not found or not authorized');
      }
      return result.rows[0];
    } catch (error) {
      throw new Error('Database error: ' + error.message);
    }
  }

  static async deleteCompleted(userId) {
    try {
      const result = await pool.query(
        'DELETE FROM todos WHERE user_id = $1 AND completed = true RETURNING *',
        [userId]
      );
      return result.rows;
    } catch (error) {
      throw new Error('Database error: ' + error.message);
    }
  }

  static async getStats(userId) {
    try {
      const result = await pool.query(`
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN completed = true THEN 1 END) as completed,
          COUNT(CASE WHEN completed = false THEN 1 END) as pending
        FROM todos 
        WHERE user_id = $1
      `, [userId]);
      return result.rows[0];
    } catch (error) {
      throw new Error('Database error: ' + error.message);
    }
  }
}

module.exports = Todo;