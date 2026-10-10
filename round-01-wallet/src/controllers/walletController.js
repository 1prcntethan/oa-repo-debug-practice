const walletService = require('../services/walletService');

function isValidAmount(amount) {
  return typeof amount === 'number' && Number.isFinite(amount) && amount > 0;
}

async function createWallet(req, res) {
  const { owner } = req.body;
  if (!owner) {
    return res.status(400).json({ error: 'owner is required' });
  }
  const wallet = await walletService.createWallet(owner);
  res.status(201).json(wallet);
}

async function getWallet(req, res) {
  const wallet = walletService.getWallet(req.params.id);
  if (!wallet) {
    return res.status(404).json({ error: 'Wallet not found' });
  }
  res.json(wallet);
}

async function deposit(req, res) {
  const { amount } = req.body;
  if (!isValidAmount(amount)) {
    return res.status(400).json({ error: 'amount must be a positive number' });
  }
  const wallet = await walletService.deposit(req.params.id, amount);
  if (!wallet) {
    return res.status(404).json({ error: 'Wallet not found' });
  }
  res.json(wallet);
}

async function withdraw(req, res) {
  const { amount } = req.query;
  if (!isValidAmount(amount)) {
    return res.status(400).json({ error: 'amount must be a positive number' });
  }
  try {
    const wallet = await walletService.withdraw(req.params.id, amount);
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }
    res.json(wallet);
  } catch (err) {
    if (err.message === 'INSUFFICIENT_FUNDS') {
      return res.status(400).json({ error: 'Insufficient funds' });
    }
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { createWallet, getWallet, deposit, withdraw };