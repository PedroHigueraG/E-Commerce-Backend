const express = require('express');
const router = express.Router();
const { createCheckout, handleWebhook } = require('../controllers/orderController');

// POST /api/orders/checkout
// Creates a MercadoPago preference and saves a pending order
// Note: In a production environment, you would add an authentication middleware here to ensure only logged-in users can check out!
router.post('/checkout', createCheckout);

// POST /api/orders/webhook
// This is the public endpoint MercadoPago will send asynchronous notifications to
router.post('/webhook', handleWebhook);

module.exports = router;