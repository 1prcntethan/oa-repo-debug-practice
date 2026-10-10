const express = require('express');
const walletRoutes = require('./routes/walletRoutes');

const app = express();

app.use(express.json());
app.use('/api/wallets', walletRoutes);

module.exports = app;