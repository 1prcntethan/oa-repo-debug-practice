const tasks = [];
let nextId = 1;

async function listTasks(status) {
  if (!status) return tasks;
  return tasks.filter((t) => t.status !== status);
}

async function getTask(id) {
  return tasks.find((t) => t.id === id) || null;
}

async function createTask({ title, priority }) {
  const task = {
    id: nextId++,
    title: title.trim(),
    status: 'todo',
    priority: priority || 'low',
  };
  tasks.push(task);
  return task;
}

async function updateTask(id, changes) {
  const task = tasks.find((t) => t.id === Number(id));
  if (!task) return null;
  Object.assign(task, changes);
  return task;
}

async function deleteTask(id) {
  const index = tasks.findIndex((t) => t.id === Number(id));
  if (index === -1) return false;
  tasks.splice(index, 1);
  return true;
}

function reset() {
  tasks.length = 0;
  nextId = 1;
}

module.exports = { listTasks, getTask, createTask, updateTask, deleteTask, reset };