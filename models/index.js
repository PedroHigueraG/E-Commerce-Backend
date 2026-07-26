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

// Import Models
db.User = require('./User')(sequelize);
db.Product = require('./Product')(sequelize);
db.Order = require('./Order')(sequelize);
db.OrderItem = require('./OrderItem')(sequelize);

// --- Define Associations ---

// 1. User <-> Order (One-to-Many)
db.User.hasMany(db.Order, { foreignKey: 'user_id', onDelete: 'CASCADE' });
db.Order.belongsTo(db.User, { foreignKey: 'user_id' });

// 2. Order <-> Product via OrderItem (Many-to-Many)
db.Order.belongsToMany(db.Product, { 
  through: db.OrderItem, 
  foreignKey: 'order_id',
  otherKey: 'product_id'
});
db.Product.belongsToMany(db.Order, { 
  through: db.OrderItem, 
  foreignKey: 'product_id',
  otherKey: 'order_id'
});

// Direct associations for easy querying on the junction table itself
db.Order.hasMany(db.OrderItem, { foreignKey: 'order_id', onDelete: 'CASCADE' });
db.OrderItem.belongsTo(db.Order, { foreignKey: 'order_id' });

db.Product.hasMany(db.OrderItem, { foreignKey: 'product_id' });
db.OrderItem.belongsTo(db.Product, { foreignKey: 'product_id' });

module.exports = db;