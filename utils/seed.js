const { sequelize, Product } = require('../models');

const seedProducts = async () => {
  try {
    // Ensure we are connected to the database
    await sequelize.authenticate();
    console.log('⏳ Database connected. Starting to seed products...');

    // The mock data array for your sports catalog
    const mockProducts = [
      {
        title: 'Pro Glide Running Shoes',
        description: 'Ultra-lightweight running shoes designed for marathon runners and casual joggers alike. Features breathable mesh and impact-absorbing soles.',
        price: 129.99,
        image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
        stock: 45,
      },
      {
        title: 'Moisture-Wicking Sports Hat',
        description: 'Keep the sun out of your eyes and the sweat off your brow with this adjustable, highly breathable athletic cap.',
        price: 24.50,
        image_url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&q=80',
        stock: 120,
      },
      {
        title: 'Performance Compression Socks',
        description: 'Ankle-length socks with arch support and targeted cushioning. Perfect for high-intensity training.',
        price: 14.99,
        image_url: 'https://images.unsplash.com/photo-1586882829491-b81178aa622e?w=500&q=80',
        stock: 300,
      },
      {
        title: 'Thermal Running Jacket',
        description: 'Windproof and water-resistant jacket for cold weather runs. Features reflective strips for night safety.',
        price: 89.99,
        image_url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80',
        stock: 25,
      }
    ];

    // Push all items into the database at once
    await Product.bulkCreate(mockProducts);
    
    console.log('✅ Mock products seeded successfully!');
    process.exit(0); // Exit the script successfully
  } catch (error) {
    console.error('❌ Error seeding the database:', error);
    process.exit(1); // Exit with a failure code
  }
};

// Execute the function
seedProducts();