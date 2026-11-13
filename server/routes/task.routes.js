const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const protect = require('../middleware/auth.middleware');
const User = require('../models/User');

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { projectId, title, description, priority, assigneeId, dueDate, status, source } = req.body;

    // Basic validation
    if (!projectId || !title) {
      return res.status(400).json({ message: 'Project ID and Title are required' });
    }

    const task = new Task({
      projectId,
      title,
      description,
      priority,
      status: status || 'todo',
      assigneeId,
      dueDate,
      source: source || 'manual',
      createdBy: req.user._id
    });

    const savedTask = await task.save();
    
    // Populate assignee for immediate UI update
    await savedTask.populate('assigneeId', 'name email');

    res.status(201).json(savedTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Server error creating task' });
  }
});

// @route   GET /api/tasks/:projectId
// @desc    Get all tasks for a project
// @access  Private
router.get('/:projectId', protect, async (req, res) => {
  try {
    const { projectId } = req.params;

    const tasks = await Task.find({ projectId })
      .populate('assigneeId', 'name email')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Server error fetching tasks' });
  }
});

// @route   PATCH /api/tasks/:id
// @desc    Update a task (status, assignee, etc.)
// @access  Private
router.patch('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const task = await Task.findByIdAndUpdate(id, updates, { new: true })
      .populate('assigneeId', 'name email')
      .populate('createdBy', 'name');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Server error updating task' });
  }
});

module.exports = router;
