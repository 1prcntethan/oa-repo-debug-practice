const TaskApi = {
  baseUrl: '/api/tasks',

  async list(status) {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    const res = await fetch(`${this.baseUrl}${query}`);
    return res.json();
  },

  async create(task) {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    return res.json();
  },

  async update(id, changes) {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(changes),
    });
    return res.json();
  },

  async remove(id) {
    const res = await fetch(`${this.baseUrl}/${id}`, { method: 'DELETE' });
    return res.ok;
  },
};

if (typeof module !== 'undefined') {
  module.exports = TaskApi;
}