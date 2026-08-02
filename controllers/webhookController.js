const { MercadoPagoConfig, Payment } = require('mercadopago');
const { Order } = require('../models');

// Initialize the MercadoPago v2 client
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN 
});

// Listen for MercadoPago Webhooks (Updated for v2)
const handleWebhook = async (req, res) => {
  try {
    const paymentId = req.query.id || req.body.data?.id;
    const topic = req.query.topic || req.body.type;

    if (topic === 'payment' && paymentId) {
      // Fetch payment details using v2 Payment class
      const payment = new Payment(client);
      const paymentInfo = await payment.get({ id: paymentId });
      
      if (paymentInfo.status === 'approved') {
        const preferenceId = paymentInfo.order.id; 
        
        await Order.update(
          { status: 'approved', mp_payment_id: paymentId },
          { where: { mp_preference_id: preferenceId } }
        );
        
        console.log(`✅ Payment ${paymentId} approved and order updated!`);
      }
    }

    res.status(200).send('Webhook received');
  } catch (error) {
    console.error('Webhook Error:', error);
    res.status(500).send('Webhook processing failed');
  }
};

module.exports = { handleWebhook };