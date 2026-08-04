const express = require('express');
const router = express.Router();
const { handleWebhook } = require('../controllers/webhookController');

// POST /api/orders/webhook
// This is the public endpoint MercadoPago will send asynchronous notifications to
// TODO: Revisar opcion de middleware para validar el token de MercadoPago, si es necesario
router.post('/mercadopago', handleWebhook);

module.exports = router;