const express = require('express');
const router = express.Router();
const { handleWebhook } = require('../controllers/webhookController');

// POST /api/orders/webhook
// This is the public endpoint MercadoPago will send asynchronous notifications to
router.post('/mercadopago', handleWebhook);

module.exports = router;