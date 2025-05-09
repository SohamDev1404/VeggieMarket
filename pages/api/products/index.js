import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      return getProducts(req, res);
    case 'POST':
      return createProduct(req, res);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// GET - Get all products
async function getProducts(req, res) {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    
    return res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ message: 'Failed to fetch products' });
  }
}

// POST - Create a new product
async function createProduct(req, res) {
  try {
    const { name, description, price, category, imageUrl } = req.body;
    
    // Validate required fields
    if (!name || price === undefined || price === null || !category) {
      return res.status(400).json({ message: 'Name, price, and category are required' });
    }
    
    // Create the product
    const product = await prisma.product.create({
      data: {
        name,
        description: description || null,
        price: parseFloat(price),
        category,
        imageUrl: imageUrl || null,
      },
    });
    
    return res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({ message: 'Failed to create product' });
  }
}
