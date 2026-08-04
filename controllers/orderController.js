const { Order, OrderItem, Product } = require('../models');
const orderService = require('../services/orderService');

const createCheckout = async (req, res) => {
  try {
    // TODO: Params validation
    const response = await orderService.createCheckout.createCheckout(req.body, req.user)

    res.status(201).json({ 
      message: 'Checkout created', 
      init_point: response.init_point,
      orderId: response.id
    });

  } catch (error) {
    console.error("Checkout Error:", error);
    res.status(500).json({ message: 'Checkout error', error: error.message });
  }
};

module.exports = { createCheckout };