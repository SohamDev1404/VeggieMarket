const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Seeding database...');

  // Create admin user
  await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@harvesthub.com',
      password: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', // Password is 'password'
      role: 'ADMIN',
    }
  });

  // Create regular user
  await prisma.user.create({
    data: {
      name: 'Test User',
      email: 'user@harvesthub.com',
      password: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', // Password is 'password'
      role: 'CUSTOMER',
    }
  });

  // Create products
  const vegetables = [
    { 
      name: 'Organic Carrots', 
      description: 'Fresh and crunchy organic carrots, perfect for salads and cooking. Locally grown without pesticides.',
      price: 2.49,
      category: 'Vegetables',
      unit: 'bundle',
      inStock: 50,
      imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=1480&auto=format&fit=crop'
    },
    { 
      name: 'Premium Broccoli', 
      description: 'Nutrient-rich broccoli florets, packed with vitamins and minerals. Excellent for steaming or stir-fry.',
      price: 3.49,
      category: 'Vegetables',
      unit: 'head',
      inStock: 35,
      imageUrl: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?q=80&w=1402&auto=format&fit=crop'
    },
    { 
      name: 'Baby Spinach', 
      description: 'Tender baby spinach leaves, full of iron and vitamins. Perfect for salads or sautéing.',
      price: 2.99,
      category: 'Vegetables',
      unit: 'bunch',
      inStock: 40,
      imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=1480&auto=format&fit=crop'
    },
    { 
      name: 'Mixed Bell Peppers', 
      description: 'Colorful bell peppers - red, yellow, and green. Sweet and crunchy, great for salads or roasting.',
      price: 4.99,
      category: 'Vegetables',
      unit: 'pack of 3',
      inStock: 30,
      imageUrl: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?q=80&w=1374&auto=format&fit=crop'
    },
    { 
      name: 'Cherry Tomatoes', 
      description: 'Sweet and juicy cherry tomatoes, perfect for salads or snacking.',
      price: 3.79,
      category: 'Vegetables',
      unit: 'pint',
      inStock: 25,
      imageUrl: 'https://images.unsplash.com/photo-1592924357220-5fbb57f4f30b?q=80&w=1470&auto=format&fit=crop'
    },
    { 
      name: 'Zucchini', 
      description: 'Fresh zucchini with tender flesh and mild flavor. Great for grilling or sautéing.',
      price: 1.99,
      category: 'Vegetables',
      unit: 'lb',
      inStock: 45,
      imageUrl: 'https://images.unsplash.com/photo-1586765501019-cbe3973ef8fa?q=80&w=1480&auto=format&fit=crop'
    },
    { 
      name: 'Red Onions', 
      description: 'Sweet and flavorful red onions, perfect for salads and sandwiches.',
      price: 1.49,
      category: 'Vegetables',
      unit: 'lb',
      inStock: 60,
      imageUrl: 'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?q=80&w=1470&auto=format&fit=crop'
    },
    { 
      name: 'Sweet Potatoes', 
      description: 'Nutritious sweet potatoes with a rich, sweet flavor. Excellent for roasting or mashing.',
      price: 2.29,
      category: 'Vegetables',
      unit: 'lb',
      inStock: 55,
      imageUrl: 'https://images.unsplash.com/photo-1596097557993-54339f4e051b?q=80&w=1470&auto=format&fit=crop'
    },
  ];

  const fruits = [
    { 
      name: 'Honeycrisp Apples', 
      description: 'Crisp and sweet Honeycrisp apples, perfect for snacking or baking.',
      price: 3.99,
      category: 'Fruits',
      unit: 'lb',
      inStock: 65,
      imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=1374&auto=format&fit=crop'
    },
    { 
      name: 'Organic Bananas', 
      description: 'Ripe yellow organic bananas, ready to eat or perfect for smoothies and baking.',
      price: 1.99,
      category: 'Fruits',
      unit: 'bunch',
      inStock: 80,
      imageUrl: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?q=80&w=1374&auto=format&fit=crop'
    },
    { 
      name: 'Fresh Strawberries', 
      description: 'Sweet and juicy strawberries, locally grown and hand-picked at peak ripeness.',
      price: 4.99,
      category: 'Fruits',
      unit: 'pint',
      inStock: 20,
      imageUrl: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?q=80&w=1470&auto=format&fit=crop'
    },
    { 
      name: 'Navel Oranges', 
      description: 'Juicy navel oranges, packed with vitamin C. Sweet and seedless.',
      price: 3.49,
      category: 'Fruits',
      unit: 'lb',
      inStock: 50,
      imageUrl: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?q=80&w=1470&auto=format&fit=crop'
    },
    { 
      name: 'Ripe Avocados', 
      description: 'Creamy Hass avocados, perfect for guacamole or toast. Ready to eat.',
      price: 2.99,
      category: 'Fruits',
      unit: 'each',
      inStock: 40,
      imageUrl: 'https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?q=80&w=1375&auto=format&fit=crop'
    },
    { 
      name: 'Fresh Blueberries', 
      description: 'Plump and sweet blueberries, packed with antioxidants. Great for snacking or baking.',
      price: 5.99,
      category: 'Fruits',
      unit: 'pint',
      inStock: 15,
      imageUrl: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?q=80&w=1469&auto=format&fit=crop'
    },
    { 
      name: 'Ripe Mangoes', 
      description: 'Sweet and juicy mangoes, perfect for smoothies, salads, or eating fresh.',
      price: 2.49,
      category: 'Fruits',
      unit: 'each',
      inStock: 30,
      imageUrl: 'https://images.unsplash.com/photo-1605027990121-cbae9e0642df?q=80&w=1470&auto=format&fit=crop'
    },
    { 
      name: 'Red Grapes', 
      description: 'Sweet and seedless red grapes, perfect for snacking or adding to fruit salads.',
      price: 3.99,
      category: 'Fruits',
      unit: 'lb',
      inStock: 45,
      imageUrl: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?q=80&w=1473&auto=format&fit=crop'
    }
  ];

  const herbs = [
    { 
      name: 'Fresh Basil', 
      description: 'Aromatic fresh basil, perfect for Italian dishes, pesto, or garnishing.',
      price: 2.49,
      category: 'Herbs',
      unit: 'bunch',
      inStock: 25,
      imageUrl: 'https://images.unsplash.com/photo-1618164264923-112086c39ace?q=80&w=1374&auto=format&fit=crop'
    },
    { 
      name: 'Fresh Cilantro', 
      description: 'Fragrant cilantro, essential for Mexican, Thai, and Indian cuisines.',
      price: 1.99,
      category: 'Herbs',
      unit: 'bunch',
      inStock: 30,
      imageUrl: 'https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&w=1476&auto=format&fit=crop'
    },
    { 
      name: 'Fresh Mint', 
      description: 'Refreshing mint leaves, great for teas, cocktails, and Mediterranean dishes.',
      price: 2.29,
      category: 'Herbs',
      unit: 'bunch',
      inStock: 20,
      imageUrl: 'https://images.unsplash.com/photo-1628614541857-211514dda81e?q=80&w=1470&auto=format&fit=crop'
    },
    { 
      name: 'Fresh Rosemary', 
      description: 'Aromatic rosemary sprigs, perfect for roasts, potatoes, and bread.',
      price: 2.49,
      category: 'Herbs',
      unit: 'bunch',
      inStock: 15,
      imageUrl: 'https://images.unsplash.com/photo-1515586000433-45406d8e6662?q=80&w=1470&auto=format&fit=crop'
    }
  ];

  for (const vegetable of vegetables) {
    await prisma.product.create({ data: vegetable });
  }

  for (const fruit of fruits) {
    await prisma.product.create({ data: fruit });
  }
  
  for (const herb of herbs) {
    await prisma.product.create({ data: herb });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
