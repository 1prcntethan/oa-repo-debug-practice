const request = require('supertest');
const app = require('../src/app');
const taskService = require('../src/services/taskService');
const TaskApi = require('../public/api');

// Routes the frontend client's fetch() calls into the Express app,
// so the frontend and backend are tested against each other.
beforeAll(() => {
  global.fetch = async (url, options = {}) => {
    const method = (options.method || 'GET').toLowerCase();
    let req = request(app)[method](url);
    if (options.body) {
      req = req.set('Content-Type', 'application/json').send(options.body);
    }
    const res = await req;
    return {
      ok: res.status >= 200 && res.status < 300,
      status: res.status,
      json: async () => res.body,
    };
  };
});

beforeEach(() => {
  taskService.reset();
});

describe('Task API', () => {
  test('POST creates a task with default status and priority', async () => {
    const res = await request(app).post('/api/tasks').send({ title: 'Buy milk' });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: 1, title: 'Buy milk', status: 'todo', priority: 'medium' });
  });

  test('POST rejects a blank title', async () => {
    const res = await request(app).post('/api/tasks').send({ title: '   ' });
    expect(res.status).toBe(400);
  });

  test('POST accepts high priority', async () => {
    const res = await request(app).post('/api/tasks').send({ title: 'Ship it', priority: 'high' });
    expect(res.status).toBe(201);
    expect(res.body.priority).toBe('high');
  });

  test('POST rejects an invalid priority', async () => {
    const res = await request(app).post('/api/tasks').send({ title: 'X', priority: 'urgent' });
    expect(res.status).toBe(400);
  });

  test('GET /api/tasks returns all tasks', async () => {
    await taskService.createTask({ title: 'A' });
    await taskService.createTask({ title: 'B' });
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  test('GET /api/tasks?status=done returns only done tasks', async () => {
    await taskService.createTask({ title: 'A' });
    await taskService.createTask({ title: 'B' });
    await taskService.updateTask(1, { status: 'done' });
    const res = await request(app).get('/api/tasks?status=done');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe('A');
  });

  test('GET /api/tasks/:id returns the task', async () => {
    await taskService.createTask({ title: 'Write report' });
    const res = await request(app).get('/api/tasks/1');
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Write report');
  });

  test('GET /api/tasks/:id returns 404 for unknown task', async () => {
    const res = await request(app).get('/api/tasks/99');
    expect(res.status).toBe(404);
  });

  test('PATCH updates a task', async () => {
    await taskService.createTask({ title: 'A' });
    const res = await request(app).patch('/api/tasks/1').send({ status: 'done' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('done');
  });

  test('PATCH rejects an invalid status', async () => {
    await taskService.createTask({ title: 'A' });
    const res = await request(app).patch('/api/tasks/1').send({ status: 'finished' });
    expect(res.status).toBe(400);
  });

  test('PATCH returns 404 for unknown task', async () => {
    const res = await request(app).patch('/api/tasks/99').send({ status: 'done' });
    expect(res.status).toBe(404);
  });

  test('DELETE removes the task and returns 204', async () => {
    await taskService.createTask({ title: 'A' });
    const res = await request(app).delete('/api/tasks/1');
    expect(res.status).toBe(204);
    const check = await request(app).get('/api/tasks/1');
    expect(check.status).toBe(404);
  });

  test('DELETE returns 404 for unknown task', async () => {
    const res = await request(app).delete('/api/tasks/99');
    expect(res.status).toBe(404);
  });
});

describe('Frontend client (public/api.js)', () => {
  test('create() sends a new task to the API', async () => {
    const task = await TaskApi.create({ title: 'From the UI', priority: 'medium' });
    expect(task.title).toBe('From the UI');
    expect(task.id).toBe(1);
  });

  test('update() changes a task through the API', async () => {
    await taskService.createTask({ title: 'Write report' });
    const updated = await TaskApi.update(1, { status: 'done' });
    expect(updated.status).toBe('done');
  });

  test('remove() deletes a task through the API', async () => {
    await taskService.createTask({ title: 'Temp' });
    const ok = await TaskApi.remove(1);
    expect(ok).toBe(true);
  });
});