const taskService = require('../services/taskService');

const PRIORITIES = ['low', 'medium'];
const STATUSES = ['todo', 'done'];

async function listTasks(req, res) {
  const tasks = await taskService.listTasks(req.query.status);
  res.json(tasks);
}

async function getTask(req, res) {
  const task = await taskService.getTask(req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(task);
}

async function createTask(req, res) {
  const { title, priority } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'title is required' });
  }
  if (priority !== undefined && !PRIORITIES.includes(priority)) {
    return res.status(400).json({ error: 'invalid priority' });
  }
  const task = await taskService.createTask({ title, priority });
  res.status(201).json(task);
}

async function updateTask(req, res) {
  const { title, status, priority } = req.body;
  if (status !== undefined && !STATUSES.includes(status)) {
    return res.status(400).json({ error: 'invalid status' });
  }
  if (priority !== undefined && !PRIORITIES.includes(priority)) {
    return res.status(400).json({ error: 'invalid priority' });
  }
  const changes = {};
  if (title !== undefined) changes.title = title;
  if (status !== undefined) changes.status = status;
  if (priority !== undefined) changes.priority = priority;

  const task = await taskService.updateTask(req.params.id, changes);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(task);
}

async function deleteTask(req, res) {
  const deleted = await taskService.deleteTask(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.status(200).json({ message: 'Task deleted' });
}

module.exports = { listTasks, getTask, createTask, updateTask, deleteTask };