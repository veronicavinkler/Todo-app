const Todo = require('../models/Todo');

class TodoController {
  static async getTodos(req, res) {
    try {
      const options = {};
      if (req.query.completed !== undefined) {
        options.completed = req.query.completed === 'true';
      }
      if (req.query.limit) {
        options.limit = parseInt(req.query.limit);
      }
      if (req.query.offset) {
        options.offset = parseInt(req.query.offset);
      }
      if (req.query.sortBy) {
        options.sortBy = req.query.sortBy;
      }
      if (req.query.sortOrder) {
        options.sortOrder = req.query.sortOrder.toUpperCase();
      }
      const todos = await Todo.findByUserId(req.session.userId, options);
      res.json(todos);
    } catch (error) {
      console.error('Error fetching todos:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getTodo(req, res) {
    try {
      const { id } = req.params;
      const todo = await Todo.findById(id, req.session.userId);
      
      if (!todo) {
        return res.status(404).json({ error: 'Todo not found' });
      }
      res.json(todo);
    } catch (error) {
      console.error('Error fetching todo:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async createTodo(req, res) {
    try {
      const { text } = req.body;
      const todo = await Todo.create(req.session.userId, text);
      res.status(201).json(todo);
    } catch (error) {
      console.error('Error creating todo:', error);
      res.status(400).json({ error: error.message });
    }
  }

  static async updateTodo(req, res) {
    try {
      const { id } = req.params;
      const updates = {};
      if (req.body.hasOwnProperty('completed')) {
        updates.completed = req.body.completed;
      }
      if (req.body.hasOwnProperty('text')) {
        updates.text = req.body.text;
      }

      const todo = await Todo.update(id, req.session.userId, updates);
      res.json(todo);
    } catch (error) {
      console.error('Error updating todo:', error);
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteTodo(req, res) {
    try {
      const { id } = req.params;
      await Todo.delete(id, req.session.userId);
      res.json({ message: 'Todo deleted successfully' });
    } catch (error) {
      console.error('Error deleting todo:', error);
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteCompleted(req, res) {
    try {
      const deletedTodos = await Todo.deleteCompleted(req.session.userId);
      res.json({ 
        message: `${deletedTodos.length} completed todos deleted`,
        deletedCount: deletedTodos.length 
      });
    } catch (error) {
      console.error('Error deleting completed todos:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getTodoStats(req, res) {
    try {
      const stats = await Todo.getStats(req.session.userId);
      res.json(stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = TodoController;