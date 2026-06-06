const Task = require('../models/Task');

const getTasks = async (req, res) => {
  try {
    const { status, priority, subject } = req.query;
    const query = { owner: req.user._id };
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (subject) query.subject = { $regex: subject, $options: 'i' };
    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch tasks.' });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, subject, tags } = req.body;
    const task = await Task.create({
      title,
      description: description || '',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      subject: subject || '',
      tags: tags ? tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean) : [],
      owner: req.user._id
    });
    res.status(201).json({ success: true, message: 'Task created successfully!', task });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create task.', error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });
    const fields = ['title', 'description', 'priority', 'status', 'dueDate', 'subject', 'tags'];
    fields.forEach(field => { if (req.body[field] !== undefined) task[field] = req.body[field]; });
    await task.save();
    res.json({ success: true, message: 'Task updated!', task });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update task.' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });
    res.json({ success: true, message: 'Task deleted successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete task.' });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };