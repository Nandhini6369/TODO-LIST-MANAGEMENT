const User = require('../models/User');
// Share a task with another user by email or username
exports.shareTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, username } = req.body;
    if (!email && !username) {
      return res.status(400).json({ message: 'Email or username required' });
    }

    // Find the user to share with
    let userToShare;
    if (email) {
      userToShare = await User.findOne({ email });
    } else if (username) {
      userToShare = await User.findOne({ name: username });
    }
    if (!userToShare) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the task and update sharedWith
    const task = await Task.findOne({ _id: id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found or not owned by you' });
    }
    if (task.sharedWith.includes(userToShare._id)) {
      return res.status(400).json({ message: 'Task already shared with this user' });
    }
    task.sharedWith.push(userToShare._id);
    await task.save();
    res.json({ message: 'Task shared successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
const Task = require('../models/Task');

// Get all tasks for the logged-in user (owned and shared)
exports.getTasks = async (req, res) => {
  try {
    const { due, priority, status } = req.query;
    const filter = {
      $or: [
        { user: req.user._id },
        { sharedWith: req.user._id }
      ]
    };

    // Filter by due date
    if (due === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      filter.dueDate = { $gte: today, $lt: tomorrow };
    } else if (due === 'overdue') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filter.dueDate = { $lt: today };
      filter.status = 'open'; // Only open tasks are overdue
    }

    // Filter by priority
    if (priority) {
      filter.priority = priority;
    }

    // Filter by status (all, open, complete)
    if (status && status !== 'all') {
      filter.status = status;
    }

    const tasks = await Task.find(filter).sort({ dueDate: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, status, priority } = req.body;
    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      dueDate,
      status,
      priority,
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data' });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data' });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid data' });
  }
};
