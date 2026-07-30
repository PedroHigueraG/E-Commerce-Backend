const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById } = require('../controllers/productController');

// GET /api/products
// Fetches the entire catalog for your home page
router.get('/', getAllProducts);

// GET /api/products/:id
// Fetches a single product's details
router.get('/:id', getProductById);

module.exports = router;