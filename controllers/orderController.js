const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');
const { Order, OrderItem, Product } = require('../models');

// Initialize the MercadoPago v2 client
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN 
});

const createCheckout = async (req, res) => {
  try {
    const { items } = req.body; 
    const userId = req.user.id; // From your JWT middleware

    let totalAmount = 0;
    const preferenceItems = [];

    // 1. Fetch real products from DB to calculate total and format for MP safely
    for (let item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) return res.status(404).json({ message: `Product ${item.productId} not found` });

      totalAmount += parseFloat(product.price) * item.quantity;

      preferenceItems.push({
        id: product.id.toString(),
        title: product.title,
        unit_price: parseFloat(product.price),
        quantity: item.quantity,
      });
    }

    // 2. Create the MercadoPago Preference using Checkout v2 API
    const preference = new Preference(client);
    const preferenceResponse = await preference.create({
      body: {
        items: preferenceItems, // Using the secure array we just built
        back_urls: {
          success: "http://localhost:3000/success",
          failure: "http://localhost:3000/failure",
          pending: "http://localhost:3000/pending"
        },
        auto_return: "approved",
        notification_url: "http://localhost:5000/api/orders/webhook" // Updated for v2,
      }
    });

    // 3. Save the Order in your database as 'pending'
    const newOrder = await Order.create({
      user_id: userId,
      total_amount: totalAmount,
      status: 'pending',
      mp_preference_id: preferenceResponse.id // response.id replaces preference.body.id in v2
    });

    // 4. Save the Order Items to your database
    for (let item of items) {
      const product = await Product.findByPk(item.productId);
      await OrderItem.create({
        order_id: newOrder.id,
        product_id: product.id,
        quantity: item.quantity,
        price_at_purchase: product.price
      });
    }

    // 5. Send checkout URL back to the frontend
    res.status(201).json({ 
      message: 'Checkout created', 
      init_point: preferenceResponse.init_point, 
      orderId: newOrder.id 
    });

  } catch (error) {
    console.error("Checkout Error:", error);
    res.status(500).json({ message: 'Checkout error', error: error.message });
  }
};

module.exports = { createCheckout };