require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models'); // Imports the Sequelize instance and models

const app = express();

// --- Middleware ---
// Enable CORS for your React frontend
app.use(cors());

// Parse incoming JSON requests (needed for auth and checkout)
app.use(express.json());

// --- Routes ---
// We will create these route files next
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/products', require('./routes/productRoutes'));
// app.use('/api/orders', require('./routes/orderRoutes'));
// app.use('/webhooks/mercadopago', require('./routes/webhookRoutes'));

// --- Basic Health Check Route ---
app.get('/', (req, res) => {
  res.send('E-commerce API is running!');
});

// --- Database Sync & Server Initialization ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Sync Sequelize models with the database
// sequelize.sync({ alter: true }) // 'alter: true' safely updates tables to match models
//   .then(() => {
//     console.log('✅ Database synchronized successfully.');
    
//     // Start the server only after the DB is synced
//     app.listen(PORT, () => {
//       console.log(`🚀 Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error('❌ Unable to connect to the database:', err);
//   });