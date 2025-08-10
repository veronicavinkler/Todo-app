const express = require('express');
const router = express.Router();
const TodoController = require('../controllers/todoController');
const { requireAuth } = require('../middleware/auth');
const { validateTodo } = require('../middleware/validation');

router.use(requireAuth);

router.get('/', TodoController.getTodos);
router.get('/stats', TodoController.getTodoStats);
router.get('/:id', TodoController.getTodo);
router.post('/', validateTodo, TodoController.createTodo);
router.put('/:id', TodoController.updateTodo);
router.delete('/:id', TodoController.deleteTodo);
router.delete('/', TodoController.deleteCompleted); // Delete all completed todos

module.exports = router;