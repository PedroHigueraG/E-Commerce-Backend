const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');

// TODO: Initialize the MercadoPago v2 client
// TODO: Agregar carrito de compras y sus funciones
const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
});


const createCheckout = async (preferenceItems) => {
    // 2. Create the MercadoPago Preference using Checkout v2 API
    // TODO: Crear variable de entorno para las urls de redireccionamiento
    const preference = new Preference(client);
    const preferenceResponse = await preference.create({
        body: {
            items: preferenceItems, // Using the secure array we just built
            back_urls: {
                success: "http://localhost:3000/success",
                failure: "http://localhost:3000/failure",
                pending: "http://localhost:3000/pending"
            },
            //auto_return: "approved",
            notification_url: "http://localhost:5000/api/webhooks/mercadopago" // Updated for v2,
        }
    });

    return preferenceResponse //TODO: format return
}

export default { createCheckout }