require('dotenv').config(); // Ensure we can read the .env variables
const { Sequelize } = require('sequelize');

// 1. Initialize the Sequelize connection
const sequelize = new Sequelize(
  process.env.DB_NAME,       // Name of your local database
  process.env.DB_USER,       // Your PostgreSQL username (often 'postgres')
  process.env.DB_PASSWORD,   // Your PostgreSQL password
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: false,          // Set to console.log to see raw SQL queries in the terminal
  }
);

// 2. Test the connection (This helps us debug if something goes wrong)
sequelize.authenticate()
  .then(() => {
    console.log('✅ PostgreSQL database connected successfully!');
  })
  .catch((error) => {
    console.error('❌ Unable to connect to the database:', error);
  });

// 3. Export the connection so server.js and our models can use it
const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;