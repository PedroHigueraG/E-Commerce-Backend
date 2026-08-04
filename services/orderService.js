const { Order, OrderItem, Product } = require('../models');
const { findById } = require('repositories/productRepository')
const gatewayClient = require('../infrastructure/payment/mercadoPagoClient')

const createCheckout = async (body, user) => {
    const { items } = body;
    const userId = user.id; // From your JWT middleware

    let totalAmount = 0;
    const preferenceItems = [];

    // 1. Fetch real products from DB to calculate total and format for MP safely
    for (let item of items) {
        const product = await findById(item.id);

        // Convert the price to a strict integer to satisfy MercadoPago
        const priceAsInteger = Math.round(Number(product.price));

        totalAmount += priceAsInteger * item.quantity;

        preferenceItems.push({
            id: product.id.toString(),
            title: product.title,
            unit_price: priceAsInteger,
            quantity: item.quantity,
        });
    }

    const realCheckout = gatewayClient.createCheckout(preferenceItems)

    // 3. Save the Order in your database as 'pending'
    // TODO: manejo de errores en caso de que no se pueda crear la orden
    // TODO: migrate to order repo
    const newOrder = await Order.create({
        user_id: userId,
        total_amount: totalAmount,
        status: 'pending',
        mp_preference_id:  realCheckout.id // response.id replaces preference.body.id in v2
    });

    // 4. Save the Order Items to your database
    for (let item of items) {
        // TODO: migrate to product repo
        const product = await Product.findByPk(item.productId);
        await OrderItem.create({
            order_id: newOrder.id,
            product_id: product.id,
            quantity: item.quantity,
            price_at_purchase: product.price
        });
    }

    return {
        orderId: newOrder.id,
        initPoint: realCheckout.initPoint,
    };
}

export default {createCheckout};