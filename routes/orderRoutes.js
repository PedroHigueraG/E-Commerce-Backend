const express = require('express');
const router = express.Router();
const { createCheckout } = require('../controllers/orderController');
const verifyToken = require('../middlewares/authMiddleware');

// POST /api/orders/checkout
// Creates a MercadoPago preference and saves a pending order
router.post('/checkout', verifyToken, createCheckout);

module.exports = router;