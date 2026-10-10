const request = require('supertest');
const app = require('../src/app');
const walletService = require('../src/services/walletService');

beforeEach(() => {
  walletService.reset();
});

describe('Wallet API', () => {
  test('POST /api/wallets creates a wallet', async () => {
    const res = await request(app).post('/api/wallets').send({ owner: 'Alice' });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: 1, owner: 'Alice', balance: 0 });
  });

  test('POST /api/wallets without owner returns 400', async () => {
    const res = await request(app).post('/api/wallets').send({});
    expect(res.status).toBe(400);
  });

  test('GET /api/wallets/:id returns the wallet', async () => {
    await walletService.createWallet('Alice');
    const res = await request(app).get('/api/wallets/1');
    expect(res.status).toBe(200);
    expect(res.body.owner).toBe('Alice');
  });

  test('GET /api/wallets/:id returns 404 for unknown wallet', async () => {
    const res = await request(app).get('/api/wallets/99');
    expect(res.status).toBe(404);
  });

  test('POST deposit increases the balance', async () => {
    await walletService.createWallet('Alice');
    const res = await request(app).post('/api/wallets/1/deposit').send({ amount: 50 });
    expect(res.status).toBe(200);
    expect(res.body.balance).toBe(50);
  });

  test('POST deposit rejects a negative amount', async () => {
    await walletService.createWallet('Alice');
    const res = await request(app).post('/api/wallets/1/deposit').send({ amount: -5 });
    expect(res.status).toBe(400);
  });

  test('POST withdraw decreases the balance', async () => {
    await walletService.createWallet('Alice');
    await walletService.deposit(1, 100);
    const res = await request(app).post('/api/wallets/1/withdraw').send({ amount: 30 });
    expect(res.status).toBe(200);
    expect(res.body.balance).toBe(70);
  });

  test('POST withdraw rejects insufficient funds', async () => {
    await walletService.createWallet('Alice');
    await walletService.deposit(1, 20);
    const res = await request(app).post('/api/wallets/1/withdraw').send({ amount: 50 });
    expect(res.status).toBe(400);
  });

  test('POST withdraw returns 404 for unknown wallet', async () => {
    const res = await request(app).post('/api/wallets/99/withdraw').send({ amount: 10 });
    expect(res.status).toBe(404);
  });
});