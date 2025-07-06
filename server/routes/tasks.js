const express = require('express');
const ensureAuth = require('../controllers/ensureAuth');
const taskController = require('../controllers/taskController');

const router = express.Router();

// All routes below require authentication
router.use(ensureAuth);

// GET /tasks - List all tasks
router.get('/', taskController.getTasks);

// POST /tasks - Create a new task
router.post('/', taskController.createTask);


// PUT /tasks/:id - Update a task
router.put('/:id', taskController.updateTask);

// POST /tasks/:id/share - Share a task with another user
router.post('/:id/share', taskController.shareTask);

// DELETE /tasks/:id - Delete a task
router.delete('/:id', taskController.deleteTask);

module.exports = router;
