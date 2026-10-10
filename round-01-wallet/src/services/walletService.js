const wallets = new Map();
let nextId = 1;

async function createWallet(owner) {
  const wallet = { id: nextId++, owner, balance: 0 };
  wallets.set(wallet.id, wallet);
  return wallet;
}

async function getWallet(id) {
  return wallets.get(Number(id)) || null;
}

async function deposit(id, amount) {
  const wallet = wallets.get(Number(id));
  if (!wallet) return null;
  wallet.balance += amount;
  return wallet;
}

async function withdraw(id, amount) {
  const wallet = wallets.get(Number(id));
  if (!wallet) return null;
  if (wallet.balance < amount) {
    throw new Error('INSUFFICIENT_FUNDS');
  }
  wallet.balance -= amount;
  return wallet;
}

function reset() {
  wallets.clear();
  nextId = 1;
}

module.exports = { createWallet, getWallet, deposit, withdraw, reset };