const express = require('express');
const controller = require('../controllers/walletController');

const router = express.Router();

router.post('/', controller.createWallet);
router.get('/:id', controller.getWallet);
router.post('/:id/deposits', controller.deposit);
router.post('/:id/withdraw', controller.withdraw);

module.exports = router;