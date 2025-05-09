const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});

  console.log('Seeding database...');

  // Create products
  const vegetables = [
    { 
      name: 'Carrots', 
      description: 'Fresh and crunchy carrots, perfect for salads and cooking.',
      price: 1.99,
      category: 'vegetable',
      imageUrl: 'https://pixabay.com/get/g59c95251614514272dd8bb9cefd8520bc031c0b741f1239905b7269320281017b9a064d780f79e50d4a7697e7937653ea3927c1b278c5459dad10a35dacdb6f5_1280.jpg'
    },
    { 
      name: 'Broccoli', 
      description: 'Nutrient-rich broccoli florets.',
      price: 2.49,
      category: 'vegetable',
      imageUrl: 'https://pixabay.com/get/gc5a6596596ea640e4843789af93bfd59ee73db37fe50b0548ef7caf477c7bae57e35f1256f4faeb1d0d22b7d4c5bb77c39de4a04f777d3049d61af0627aa4167_1280.jpg'
    },
    { 
      name: 'Spinach', 
      description: 'Leafy green spinach, full of iron and vitamins.',
      price: 1.79,
      category: 'vegetable',
      imageUrl: 'https://pixabay.com/get/gf311a81a4c2c99f653b174e9d90e5a452d1772b4d8ba382c492138f727d62b2b749cf36ffb6323ac1c7e4326e03b8de8ef261f558afa497af5808ff6405ad7fa_1280.jpg'
    },
    { 
      name: 'Bell Peppers', 
      description: 'Colorful bell peppers, sweet and crunchy.',
      price: 3.29,
      category: 'vegetable',
      imageUrl: 'https://pixabay.com/get/ga16c89a8aaa511bd783a9a88b7069a6178f6c3ebecbd7ab912362ae850fdf2c00bc46e9ae688b698fc353238fc57feff019e67ae19bdf724b59328573883fa76_1280.jpg'
    },
  ];

  const fruits = [
    { 
      name: 'Apples', 
      description: 'Crisp and sweet apples, perfect for snacking.',
      price: 2.19,
      category: 'fruit',
      imageUrl: 'https://pixabay.com/get/ge175bb409d052d34f45a5175285238bff07d546ba1d7fd6e628e63b736098683dae38ea057cf1e7141f496d6c3924917ef67aac9d3bf0cfc6225dabf745aa71c_1280.jpg'
    },
    { 
      name: 'Bananas', 
      description: 'Ripe yellow bananas, ready to eat.',
      price: 1.29,
      category: 'fruit',
      imageUrl: 'https://pixabay.com/get/g2046330168b7b0cc79e0a2949a14a17c0858870933b0a38a7aef5b0dadcc18d058d52e5b546ff623ed89efda4be00146304d2ade0811b335e1d5a4bdac2e308d_1280.jpg'
    },
    { 
      name: 'Strawberries', 
      description: 'Sweet and juicy strawberries.',
      price: 3.99,
      category: 'fruit',
      imageUrl: 'https://pixabay.com/get/g9abe6d0bdf173767f24cbbb1a7c7b27e2ab98a8af5be62c3f29ab356bb35f243a76149cb0642f9768d48d996d17751f7eeb1ae75cf50b09869c5246d93d46136_1280.jpg'
    },
    { 
      name: 'Oranges', 
      description: 'Juicy oranges, packed with vitamin C.',
      price: 2.49,
      category: 'fruit',
      imageUrl: 'https://pixabay.com/get/gc05c824410a2b976b4d8f7dd5dd87d046367c97e217bdcd5fee8a7c16f7d9153b68f8b923949e6cf49076637c3d35a934d450567197fbd7d3c8c3d3e5f2e7907_1280.jpg'
    },
  ];

  for (const vegetable of vegetables) {
    await prisma.product.create({ data: vegetable });
  }

  for (const fruit of fruits) {
    await prisma.product.create({ data: fruit });
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
